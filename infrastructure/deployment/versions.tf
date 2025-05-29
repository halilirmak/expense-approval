terraform {
  required_version = ">= 0.15"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 4.8"
    }
    backend "s3" {
      bucket = "terraform-state-application"
      key    = "terraform.tfstate"
      region = "eu-west-1"
    }
  }
}
