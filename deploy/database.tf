// provision rds instance
resource "aws_db_subnet_group" "rds-subnet-group" {
    name = "rds-subnets"
    subnet_ids = [aws_subnet.private-subnet.id, aws_subnet.private-subnet-2.id]
    tags = {
        Name = "roost-rds-subnet-group"
    }
}

resource "aws_db_instance" "rds-instance" {
  engine = "postgres"
  engine_version = "14.13-R1"
  multi_az = false
  identifier = "roost-rds-instance"
  username = var.username
  password = var.password
  instance_class = "db.t3.micro"
  allocated_storage = 20
  db_subnet_group_name = aws_db_subnet_group.rds-subnet-group.name
  license_model = "postgresql-license"
  publicly_accessible = false
  
}