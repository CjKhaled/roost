// ec2 vars
variable "ec2-ami" {
  description = "ami for ec2"
  type        = string
}

variable "ec2-instance-type" {
  description = "instance type for ec2"
  type        = string
}

variable "ec2-key" {
  description = "key for ec2 login"
  type        = string
}

variable "ec2-instance-name" {
  description = "name for ec2 instance"
  type        = string
}

// db vars
variable "db-secret" {
  description = "secret for db creds"
  type        = string
}

variable "db-subnet-group-name" {
  description = "name for db-subnet"
  type        = string
}

variable "db-engine" {
  description = "engine for db"
  type        = string
}

variable "db-engine-version" {
  description = "version for db engine"
  type        = string
}

variable "db-identifier" {
  description = "identifier for db instance"
  type        = string
}

variable "db-instance-class" {
  description = "instance class for db instance"
  type        = string
}

variable "db-storage" {
  description = "storage for db instance"
  type        = number
}

variable "db-license-model" {
  description = "license model for db"
  type        = string
}

variable "db-name" {
  description = "database name"
  type        = string
}

// networking vars
variable "vpc-name" {
  description = "name of the vpc"
  type = string
}

variable "vpc-cidr-block" {
  description = "cidr-block for the vpc"
  type = string
}

variable "vpc-public-subnet-name" {
  description = "name of public subnet"
  type = string
}

variable "vpc-public-subnet-cidr-block" {
  description = "cidr block for public subnet"
  type = string
}

variable "vpc-public-subnet-avail-zone" {
  description = "availability zone for public subnet"
  type = string
}

variable "vpc-private-subnet-name" {
  description = "name of private subnet"
  type = string
}

variable "vpc-private-subnet-cidr-block" {
  description = "cidr block for private subnet"
  type = string
}

variable "vpc-private-subnet-avail-zone" {
  description = "availability zone for private subnet"
  type = string
}

variable "vpc-private-subnet-2-name" {
  description = "name of second private subnet"
  type = string
}

variable "vpc-private-subnet-2-cidr-block" {
  description = "cidr block for second private subnet"
  type = string
}

variable "vpc-private-subnet-2-avail-zone" {
  description = "availability zone for second private subnet"
  type = string
}

variable "internet-gateway-name" {
  description = "name of internet gateway"
  type = string
}

variable "public-route-table-name" {
  description = "name of public route table"
  type = string
}

variable "allow-all-cidr-block" {
  description = "cidr-block that allows all access"
  type = string
}

variable "private-route-table-name" {
  description = "name of private route table"
  type = string
}

variable "security-group-name" {
  description = "name of security group"
  type = string
}

variable "rds-security-group-name" {
  description = "name of rds security group"
  type = string
}

variable "ip-protocol" {
  description = "ip protocol for communication"
  type = string
}

// state
variable "s3-bucket-name" {
  description = "name of s3 bucket"
  type = string
}

variable "dynamodb-name" {
  description = "name of dynamo db table"
  type = string
}

// ecr 
variable "ecr-repo-name" {
  description = "name of ecr repository"
  type = string
}





