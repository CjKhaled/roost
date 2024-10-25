// ec2 vars
ec2-ami = "ami-06b21ccaeff8cd686"
ec2-instance-type = "t2.micro"
ec2-instance-name = "roost-ec2-backend"
ec2-key = "new-standard-key"

// db vars
db-subnet-group-name = "roost-rds-subnet-group"
db-engine = "postgres"
db-engine-version = "14.13"
db-identifier = "roost-rds-instance"
db-instance-class = "db.t3.micro"
db-license-model = "postgresql-license"
db-name = "roostdb"
db-secret = "roost-db-crendentials"
db-storage = 20

// networking vars
vpc-name = "roost-vpc"
vpc-cidr-block = "10.0.0.0/16"
vpc-public-subnet-name = "roost-public-subnet"
vpc-public-subnet-avail-zone = "us-east-1a"
vpc-public-subnet-cidr-block = "10.0.1.0/24"
vpc-private-subnet-name = "roost-private-subnet"
vpc-private-subnet-avail-zone = "us-east-1b"
vpc-private-subnet-cidr-block = "10.0.2.0/24"
vpc-private-subnet-2-name = "roost-private-subnet-2"
vpc-private-subnet-2-avail-zone = "us-east-1c"
vpc-private-subnet-2-cidr-block = "10.0.3.0/24"
internet-gateway-name = "roost-internet-gateway"
allow-all-cidr-block = "0.0.0.0/0"
public-route-table-name = "roost-public-route-table"
private-route-table-name = "roost-private-route-table"
security-group-name = "roost-security-group"
rds-security-group-name = "roost-db-security-group"
ip-protocol = "tcp"

// state
s3-bucket-name = "terraform-roost-state-unique"
dynamodb-name = "terraform-roost-state-locking"

// ecr
ecr-repo-name = "roost-ecr-repo"