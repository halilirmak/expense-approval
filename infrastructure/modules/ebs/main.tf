module "iam" {
  source             = "../iam_role/"
  name               = "${var.app_name}-beanstalk-role"
  assume_role_policy = "../iam/policies/beanstalk_assume_role.json"
  policies = templatefile("${path.module}../iam/policies/app_role.json", {
    docker_image_url = var.docker_image_url
  })
  tags = var.tags
}

resource "aws_iam_instance_profile" "this" {
  name = "${var.app_name}-elasticbeanstalk-profile"
  role = module.iam.role_arn
}

resource "aws_elastic_beanstalk_application" "this" {
  name        = var.app_name
  description = var.description
}

resource "aws_elastic_beanstalk_environment" "this" {
  name                = var.app_name
  application         = aws_elastic_beanstalk_application.this.name
  solution_stack_name = "64bit Amazon Linux 2 v5.8.4 running Docker"

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = aws_iam_instance_profile.this.name
  }
  setting {
    namespace = "aws:elasticbeanstalk:container:docker"
    name      = "Image"
    value     = var.docker_image_url
  }

  dynamic "setting" {
    for_each = var.env_vars
    content {
      namespace = "aws:elasticbeanstalk:application:environment"
      name      = setting.key
      value     = setting.value
    }
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "VPCId"
    value     = var.vpc_id
  }
  setting {
    namespace = "aws:ec2:vpc"
    name      = "Subnets"
    value     = join(",", var.subnets)
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "SecurityGroups"
    value     = var.security_group_id
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "AssociatePublicIpAddress"
    value     = "true"
  }
}
