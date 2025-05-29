variable "app_name" {}
variable "description" { default = "" }
variable "docker_image_url" { type = string }
variable "vpc_id" { type = string }
variable "subnets" { type = list(any) }
variable "security_group_id" { type = string }
variable "env_vars" {
  type = map(string)
  default = {
    PORT          = "3000"
    APP_NAME      = "app"
    APP_LOG_LEVEL = "debug"
  }
}
