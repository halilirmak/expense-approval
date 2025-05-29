
resource "aws_db_subnet_group" "this" {
  name       = "${var.name}-rds-subnet-group"
  subnet_ids = var.subnet_group_ids

  tags = {
    Name = "${var.name}-rds-subnet-group"
  }
}

resource "aws_db_instance" "postgress" {
  identifier             = "${var.name}-postgress"
  engine                 = "postgress"
  engine_version         = "15.3"
  instance_class         = var.instance_class
  allocated_storage      = 20
  storage_type           = "gp2"
  publicly_accessible    = false
  vpc_security_group_ids = var.vpc_security_group_ids
  db_subnet_group_name   = aws_db_subnet_group.this.name
  db_name                = var.secrets.db_credentials.db_name
  username               = var.secrets.db_credentials.username
  password               = var.secrets.db_credentials.password

  tags = {
    Name = "${var.name}-postgress"
  }
}
