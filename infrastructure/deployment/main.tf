data "aws_secretsmanager_secret_version" "db_secret" {
  secret_id = "/app-secrets-${terraform.workspace}"
}

locals {
  secrets = jsondecode(data.aws_secretsmanager_secret_version.db_secret.secret_string)
}

//::::::::::::::::::::
module "vpc" {
  source          = "../modules/vpc"
  name            = "vpc"
  vpc_cidr        = "10.0.0.0/24"
  public_subnets  = ["10.0.0.32/27", "10.0.0.64/27"]
  private_subnets = ["10.0.0.96/27", "10.0.0.128/27"]
  environment     = terraform.workspace
}


//::::::::::::::::::::
module "ebs_security_group" {
  depends_on  = [module.vpc]
  name        = "ebs_security_group"
  environment = terraform.workspace
  vpc_id      = var.tbe_main_vpc_id
  source      = "../definitions/security_groups"
  rules = {
    public_out = {
      type        = "egress"
      from_port   = 0
      to_port     = 0
      protocol    = "ALL"
      cidr_blocks = ["0.0.0.0/0"]
    },
    public_in = {
      type        = "ingress"
      from_port   = 3000
      to_port     = 3000
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    },
  }
}

//::::::::::::::::::::
module "rds_security_group" {
  depends_on  = [module.vpc]
  name        = "rds_security_group"
  environment = terraform.workspace
  vpc_id      = var.tbe_main_vpc_id
  source      = "../definitions/security_groups"
  rules = {
    public_out = {
      type        = "egress"
      from_port   = 0
      to_port     = 0
      protocol    = "ALL"
      cidr_blocks = ["0.0.0.0/0"]
    },
    public_in = {
      type        = "ingress"
      from_port   = 5432
      to_port     = 5432
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    },
  }
}

//::::::::::::::::::::
module "rds" {
  depends_on             = [module.vpc]
  source                 = "../modules/rds"
  name                   = "app_rds"
  vpc_security_group_ids = [module.rds_security_group.id]
  subnet_group_ids       = module.vpc.private_subnet_ids
  secrets                = local.secrets
}

//::::::::::::::::::::
module "ecr" {
  source            = "../modules/ecr"
  name              = "app_ecr"
  environment       = terraform.workspace
  expire_after_days = 14
}

//::::::::::::::::::::
module "elastic_beanstalk" {
  depends_on        = [module.vpc, module.ecr]
  source            = "../modules/ebs"
  app_name          = "app"
  docker_image_url  = module.ecr.docker_image_url
  vpc_id            = module.vpc.id
  subnets           = module.vpc.public_subnet_ids
  security_group_id = module.ebs_security_group.id
  env_vars = {
    PORT             = local.secrets.port
    APP_NAME         = local.secrets.app_name
    APP_LOG_LEVEL    = local.secrets.log_level
    APP_DATABASE_URL = local.secrets.connection_string
  }
}
