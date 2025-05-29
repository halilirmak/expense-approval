
variable "name" { type = string }

variable "instance_class" {
  default = "db.t3.micro"
}

variable "vpc_security_group_ids" {
  type = list(any)
}

variable "subnet_group_ids" {
  type = list(any)
}

variable "secrets" {
  sensitive = true
  type      = map(any)
}
