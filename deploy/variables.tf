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
