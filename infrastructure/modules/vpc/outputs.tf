output "id" {
  value = aws_vpc.main.id
}

output "private_subnet_ids" {
  value = aws_subnet.private[*].id
}

output "public_subnet_ids" {
  value = aws_subnet.public[*].id
}

output "private_subnet_az" {
  value = aws_subnet.private[*].availability_zone
}

output "public_subnet_az" {
  value = aws_subnet.public[*].availability_zone
}
