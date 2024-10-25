// remember to add secret in console, or it won't work
data "aws_secretsmanager_secret_version" "roost-db-crendentials" {
  secret_id = var.db-secret
}

locals {
  db_creds = jsondecode(data.aws_secretsmanager_secret_version.roost-db-crendentials.secret_string)
}

// provision rds instance
resource "aws_db_subnet_group" "rds-subnet-group" {
  name       = var.db-subnet-group-name
  subnet_ids = [aws_subnet.private-subnet.id, aws_subnet.private-subnet-2.id]
  tags = {
    Name = var.db-subnet-group-name
  }
}

resource "aws_db_instance" "rds-instance" {
  engine                 = var.db-engine
  engine_version         = var.db-engine-version
  multi_az               = false
  identifier             = var.db-identifier
  username               = local.db_creds.username
  password               = local.db_creds.password
  instance_class         = var.db-instance-class
  allocated_storage      = var.db-storage
  db_subnet_group_name   = aws_db_subnet_group.rds-subnet-group.name
  license_model          = var.db-license-model
  publicly_accessible    = false
  vpc_security_group_ids = [aws_security_group.rds-security-group.id]
  db_name                = var.db-name
  skip_final_snapshot    = true
}
