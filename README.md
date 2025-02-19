# Image Rekognition Demo with AWS  

This project demonstrates the use of **AWS Rekognition** to analyze images for labels and facial attributes. It utilizes:  
- **EC2** for hosting the Node.js application.  
- **S3 Bucket** for storing images.  
- **IAM Role** for secure access to Rekognition and S3.  
- **Security Groups** to control inbound and outbound traffic.  

---

## Features  
- Upload images for analysis.  
- Detect image labels (e.g., objects, scenes).  
- Analyze facial attributes (e.g., emotions, age range).  

---

## Prerequisites  
- **AWS Account** with admin access.  
- **Node.js** and **npm** installed on your local machine.  
- **EC2 Instance** with SSH access.  
- **AWS CLI** configured on your EC2 instance.  

---

## Architecture Overview  
- **EC2 Instance**: Hosts the Node.js Express application.  
- **S3 Bucket**: Stores uploaded images.  
- **AWS Rekognition**: Analyzes the images.  
- **IAM Role**: Grants the necessary permissions for Rekognition and S3 access.  
- **Security Groups**: Restricts access to the application.  

---

### For more details see document which i attached in AWS_Document

## This README should help others understand the project setup, architecture, and AWS configurations. If you need any other modifications, feel free to ask! 🚀
