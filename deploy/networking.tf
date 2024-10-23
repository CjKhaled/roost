// provision VPC
resource "aws_vpc" "vpc" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "roost-vpc"
  }
}

// provision subnets
resource "aws_subnet" "public-subnet" {
  vpc_id = aws_vpc.vpc.id
  availability_zone = "us-east-1a"
  cidr_block = "10.0.1.0/24"
  tags = {
    Name = "roost-public-subnet"
  }
}

resource "aws_subnet" "private-subnet" {
  vpc_id = aws_vpc.vpc.id
  availability_zone = "us-east-1b"
  cidr_block = "10.0.2.0/24"
  tags = {
    Name = "roost-private-subnet"
  }
}

resource "aws_subnet" "private-subnet-2" {
  vpc_id = aws_vpc.vpc.id
  availability_zone = "us-east-1c"
  cidr_block = "10.0.3.0/24"
  tags = {
    Name = "roost-private-subnet-2"
  }
}

// provision gateway
resource "aws_internet_gateway" "internet-gateway" {
  vpc_id = aws_vpc.vpc.id
  tags = {
    Name = "roost-internet-gateway"
  }
}

// provision route tables
resource "aws_route_table" "public-route-table" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.internet-gateway.id
  }

  tags = {
    Name = "roost-public-route-table"
  }
}

resource "aws_route_table" "private-route-table" {
  vpc_id = aws_vpc.vpc.id
  tags = {
    Name = "roost-private-route-table"
  }
}

resource "aws_route_table_association" "roost-public-association" {
  subnet_id = aws_subnet.public-subnet.id
  route_table_id = aws_route_table.public-route-table.id
}

resource "aws_route_table_association" "roost-private-association" {
  subnet_id = aws_subnet.private-subnet.id
  route_table_id = aws_route_table.private-route-table.id
}

resource "aws_route_table_association" "roost-private-association" {
  subnet_id = aws_subnet.private-subnet-2.id
  route_table_id = aws_route_table.private-route-table.id
}

// provision security groups
resource "aws_security_group" "security-group" {
  description = "allow-web-traffic"
  vpc_id = aws_vpc.vpc.id
  tags = {
    Name = "roost-security-group"
  }
}

resource "aws_security_group" "rds-security-group" {
  vpc_id = aws_vpc.vpc.id
  
}

resource "aws_vpc_security_group_ingress_rule" "allow-ssh" {
  security_group_id = aws_security_group.security-group.id
  from_port = 22
  to_port = 22
  cidr_ipv4 = "0.0.0.0/0"
  ip_protocol = "tcp"
}

resource "aws_vpc_security_group_ingress_rule" "allow-http" {
  security_group_id = aws_security_group.security-group.id
  from_port = 80
  to_port = 80
  cidr_ipv4 = "0.0.0.0/0"
  ip_protocol = "tcp"
}

resource "aws_vpc_security_group_ingress_rule" "allow-https" {
  security_group_id = aws_security_group.security-group.id
  from_port = 443
  to_port = 443
  cidr_ipv4 = "0.0.0.0/0"
  ip_protocol = "tcp"
}