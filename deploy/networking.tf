// provision VPC
resource "aws_vpc" "vpc" {
  cidr_block = var.vpc-cidr-block
  tags = {
    Name = var.vpc-name
  }
}

// provision subnets
resource "aws_subnet" "public-subnet" {
  vpc_id            = aws_vpc.vpc.id
  availability_zone = var.vpc-public-subnet-avail-zone
  cidr_block        = var.vpc-public-subnet-cidr-block
  map_public_ip_on_launch = true
  tags = {
    Name = var.vpc-public-subnet-name
  }
}

resource "aws_subnet" "private-subnet" {
  vpc_id            = aws_vpc.vpc.id
  availability_zone = var.vpc-private-subnet-avail-zone
  cidr_block        = var.vpc-private-subnet-cidr-block
  tags = {
    Name = var.vpc-private-subnet-name
  }
}

resource "aws_subnet" "private-subnet-2" {
  vpc_id            = aws_vpc.vpc.id
  availability_zone = var.vpc-private-subnet-2-avail-zone
  cidr_block        = var.vpc-private-subnet-2-cidr-block
  tags = {
    Name = var.vpc-private-subnet-2-name
  }
}

// provision gateway
resource "aws_internet_gateway" "internet-gateway" {
  vpc_id = aws_vpc.vpc.id
  tags = {
    Name = var.internet-gateway-name
  }
}

// provision route tables
resource "aws_route_table" "public-route-table" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block = var.allow-all-cidr-block
    gateway_id = aws_internet_gateway.internet-gateway.id
  }

  tags = {
    Name = var.public-route-table-name
  }
}

resource "aws_route_table" "private-route-table" {
  vpc_id = aws_vpc.vpc.id
  tags = {
    Name = var.private-route-table-name 
  }
}

resource "aws_route_table_association" "roost-public-association" {
  subnet_id      = aws_subnet.public-subnet.id
  route_table_id = aws_route_table.public-route-table.id
}

resource "aws_route_table_association" "roost-private-association" {
  subnet_id      = aws_subnet.private-subnet.id
  route_table_id = aws_route_table.private-route-table.id
}

resource "aws_route_table_association" "roost-private-association-2" {
  subnet_id      = aws_subnet.private-subnet-2.id
  route_table_id = aws_route_table.private-route-table.id
}

// provision security groups
resource "aws_security_group" "security-group" {
  description = "allow-web-traffic"
  vpc_id      = aws_vpc.vpc.id
  tags = {
    Name = var.security-group-name
  }
}

resource "aws_security_group" "rds-security-group" {
  vpc_id = aws_vpc.vpc.id
  tags = {
    Name = var.rds-security-group-name
  }
}

resource "aws_vpc_security_group_ingress_rule" "allow-db-access" {
  security_group_id            = aws_security_group.rds-security-group.id
  referenced_security_group_id = aws_security_group.security-group.id
  ip_protocol                  = var.ip-protocol
  from_port                    = 5432
  to_port                      = 5432
}

resource "aws_vpc_security_group_egress_rule" "allow-db-outbound" {
  security_group_id            = aws_security_group.rds-security-group.id
  ip_protocol                  = var.ip-protocol
  from_port                    = 5432
  to_port                      = 5432
  cidr_ipv4                    = "0.0.0.0/0"
}

resource "aws_vpc_security_group_ingress_rule" "allow-ssh" {
  security_group_id = aws_security_group.security-group.id
  from_port         = 22
  to_port           = 22
  cidr_ipv4         = var.allow-all-cidr-block
  ip_protocol       = var.ip-protocol
}

resource "aws_vpc_security_group_ingress_rule" "allow-http" {
  security_group_id = aws_security_group.security-group.id
  from_port         = 80
  to_port           = 80
  cidr_ipv4         = var.allow-all-cidr-block
  ip_protocol       = var.ip-protocol
}

resource "aws_vpc_security_group_ingress_rule" "allow-https" {
  security_group_id = aws_security_group.security-group.id
  from_port         = 443
  to_port           = 443
  cidr_ipv4         = var.allow-all-cidr-block
  ip_protocol       = var.ip-protocol
}

resource "aws_vpc_security_group_egress_rule" "allow_all_outbound" {
  security_group_id = aws_security_group.security-group.id
  ip_protocol       = "-1"  # All protocols
  from_port         = -1
  to_port           = -1
  cidr_ipv4         = "0.0.0.0/0"
}
