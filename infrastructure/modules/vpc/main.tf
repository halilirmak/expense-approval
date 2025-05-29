resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  instance_tenancy     = "default"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "${var.name}-VPC-${var.environment}"
  }
}


//Internet Gateway

resource "aws_internet_gateway" "igw" {
  depends_on = [aws_vpc.main]
  vpc_id     = aws_vpc.main.id
  tags = {
    Name = "${var.name}-IGW-${var.environment}"
  }
}

data "aws_availability_zones" "available" {}

//Public Subnet
resource "aws_subnet" "public" {
  depends_on        = [aws_vpc.main]
  count             = length(var.public_subnets)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.public_subnets[count.index]
  availability_zone = data.aws_availability_zones.available.names[count.index]
  tags = {
    Name = "${var.name}-Public-Subnet-${var.environment}"
  }
}
//Private Subnet
resource "aws_subnet" "private" {
  depends_on        = [aws_vpc.main]
  count             = length(var.private_subnets)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnets[count.index]
  availability_zone = data.aws_availability_zones.available.names[count.index]
  tags = {
    Name = "${var.name}-Private-Subnet-${var.environment}"
  }
}


//Nat Gateway
resource "aws_eip" "natIP" {
  vpc = true
  tags = {
    Name = "${var.name}-EIP-${var.environment}"
  }
}

//Only first public ip associeted with nat_gateway
resource "aws_nat_gateway" "natGateway" {
  depends_on    = [aws_eip.natIP, aws_subnet.public]
  allocation_id = aws_eip.natIP.id
  subnet_id     = aws_subnet.public[0].id
  tags = {
    Name = "${var.name}-NATGateway-${var.environment}"
  }
}

//Route Tables
resource "aws_route_table" "public" {
  depends_on = [aws_subnet.public]
  vpc_id     = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
  tags = {
    Name = "${var.name}-Public-RT-${var.environment}"
  }
}

resource "aws_route_table" "private" {
  depends_on = [aws_subnet.private]
  vpc_id     = aws_vpc.main.id
  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.natGateway.id
  }
  tags = {
    Name = "${var.name}-Private-RT-${var.environment}"
  }
}


resource "aws_route_table_association" "publicRTAssociation" {
  depends_on     = [aws_subnet.public]
  count          = length(aws_subnet.public)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "privateRTAssociation" {
  depends_on     = [aws_subnet.private]
  count          = length(aws_subnet.private)
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private.id
}
