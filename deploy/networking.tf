// provision VPC
resource "aws_vpc" "roost-vpc" {
  cidr_block = "10.0.0.0/16"
}

// provision subnets
resource "aws_subnet" "roost-public-subnet" {
  vpc_id = aws_vpc.roost-vpc
  availability_zone = "us-east-1a"
  cidr_block = "10.0.1.0/24"
}

resource "aws_subnet" "roost-private-subnet" {
  vpc_id = aws_vpc.roost-vpc
  availability_zone = "us-east-1b"
  cidr_block = "10.0.2.0/24"
}

// provision gateway
resource "aws_internet_gateway" "roost-internet-gateway" {
  vpc_id = aws_vpc.roost-vpc
}

// provision route tables
resource "aws_route_table" "roost-public-route-table" {
  vpc_id = aws_vpc.roost-vpc

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.roost-internet-gateway
  }
}

resource "aws_route_table" "roost-private-route-table" {
  vpc_id = aws_vpc.roost-vpc
}

resource "aws_route_table_association" "roost-public-association" {
  subnet_id = aws_subnet.roost-public-subnet
  route_table_id = aws_route_table.roost-public-route-table
}

resource "aws_route_table_association" "roost-private-association" {
  subnet_id = aws_subnet.roost-private-subnet
  route_table_id = aws_route_table.roost-private-route-table
}