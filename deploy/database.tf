# // remember to add secret in console, or it won't work
# data "aws_secretsmanager_secret_version" "roost-db-crendentials" {
#   secret_id = "roost-db-crendentials"
# }

# locals {
#   db_creds = jsondecode(data.aws_secretsmanager_secret_version.roost-db-crendentials.secret_string)
# }

# // provision rds instance
# resource "aws_db_subnet_group" "rds-subnet-group" {
#   name       = "rds-subnets"
#   subnet_ids = [aws_subnet.private-subnet.id, aws_subnet.private-subnet-2.id]
#   tags = {
#     Name = "roost-rds-subnet-group"
#   }
# }

# resource "aws_db_instance" "rds-instance" {
#   engine                 = "postgres"
#   engine_version         = "14.13"
#   multi_az               = false
#   identifier             = "roost-rds-instance"
#   username               = local.db_creds.username
#   password               = local.db_creds.password
#   instance_class         = "db.t3.micro"
#   allocated_storage      = 20
#   db_subnet_group_name   = aws_db_subnet_group.rds-subnet-group.name
#   license_model          = "postgresql-license"
#   publicly_accessible    = false
#   vpc_security_group_ids = [aws_security_group.rds-security-group.id]
#   db_name                = "roostdb"
#   skip_final_snapshot    = true
# }
