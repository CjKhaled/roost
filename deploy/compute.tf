// provision ec2 instance
resource "aws_instance" "ec2-instance" {
  ami = "ami-06b21ccaeff8cd686"
  instance_type = "t2.micro"
  key_name = "standard-key"
  subnet_id = aws_subnet.public-subnet.id
  associate_public_ip_address = true
  vpc_security_group_ids = [aws_security_group.security-group.id]
  tags = {
    Name = "roost-ec2-backend"
  }  
}