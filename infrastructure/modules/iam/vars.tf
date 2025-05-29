variable "name" { type = string }
variable "assume_role_policy" { type = string }
variable "tags" { type = map(string) }
variable "policies" {
  type    = list(string)
  default = []
}
