terraform {
  backend "s3" {
    bucket         = "terraform-roost-state-unique"
    key            = "roost-state/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-roost-state-locking"
    encrypt        = true
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}



