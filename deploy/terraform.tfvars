// ec2 vars
ec2-ami = "ami-06b21ccaeff8cd686"
ec2-instance-type = "t2.micro"
ec2-instance-name = "roost-ec2-backend"
ec2-key = "standard-key"

// db vars
db-subnet-group-name = "roost-rds-subnet-group"
db-engine = "postgres"
db-engine-version = "14.13-R1"
db-identifier = "roost-rds-instance"
db-instance-class = "db.t3.micro"
db-license-model = "postgresql-license"
db-name = "roostdb"
db-secret = "roost-db-credentials"
db-storage = 20
