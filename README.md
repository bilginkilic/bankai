# Bankai - Document QA System

## Overview
Bankai is an intelligent document question-answering system designed to extract and provide information from uploaded documents. The system allows users to upload PDF, DOCX, and TXT files, then query information from these documents using natural language questions.

## Purpose
The primary purpose of this system is to enable quick information retrieval from documents without requiring users to read through entire files. Users can simply ask questions about the document content, and the system provides relevant answers based on the document's information.

## Technology Stack

### Backend
- **Flask**: Python web framework used to build the REST API
- **BERT (Bidirectional Encoder Representations from Transformers)**: Pre-trained language model from Google, used for question-answering capabilities
- **Transformers library**: Hugging Face's implementation of transformer models
- **PyPDF2**: PDF parsing library to extract text from PDF documents
- **python-docx**: Library to extract text from Microsoft Word documents
- **SQLite**: Lightweight database for file and status management

### Frontend
- **HTML/CSS/JavaScript**: For the user interface
- **Fetch API**: For asynchronous communication with the backend

### Architecture
The system follows a client-server architecture:
1. **Document Processing Pipeline**:
   - Document upload
   - Text extraction
   - Storage management
   
2. **Question-Answering Pipeline**:
   - Natural language question processing
   - BERT-based context analysis
   - Answer extraction
   - Fallback to predefined answers for common questions

## Features
- Upload and manage multiple document types (PDF, DOCX, TXT)
- Ask questions about document content in natural language
- Predefined answers for common questions about "Alice in Wonderland"
- Intelligent context selection from documents to improve answer accuracy
- File management with clear status indicators
- Error handling and detailed logging

## Technical Details

### BERT Question-Answering
The system uses BERT's contextual understanding to:
1. Tokenize the question and context
2. Process through the transformer architecture
3. Identify the most likely span of text containing the answer
4. Handle cases where no answer is found

### Document Processing
For each document type:
- PDF: Extracts text from all pages using PyPDF2
- DOCX: Extracts text from paragraphs using python-docx
- TXT: Reads text directly with UTF-8 encoding

### Optimization
- Context truncation to handle BERT's 512 token limit
- Paragraph filtering based on question keywords
- Fallback mechanism to predefined answers for common questions

## Deployment Requirements
- macOS (Tested on Darwin 24.3.0)
- Python 3.8+
- Flask web server
- At least 4GB RAM for BERT model
- Storage space for uploaded documents
- HTTPS for secure communication (recommended for production)

## Quick Start Guide

### Installation

```bash
# Clone the repository
git clone https://github.com/bilginkilic/bankai.git
cd bankai

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Running the Application

```bash
# Start the application
python app.py
```

The application will be available at http://localhost:8000

### Usage

1. Access the web interface at http://localhost:8000
2. Upload documents using the upload form
3. Wait for the document to be processed
4. Ask questions about the document content using the question form
5. View and download documents as needed

## Limitations
- BERT model has a 512 token limit for context
- Processing large documents may require significant memory
- Question-answering is limited to explicit information in the documents
- The system performs best with well-structured text

## Troubleshooting

If the application fails to start or stops responding, use the following command:

```bash
pkill -f "python app.py" && cd /path/to/bankai && source venv/bin/activate && PYTHONUNBUFFERED=1 python app.py
```

For example, on the development environment:
```bash
pkill -f "python app.py" && cd /Users/bilginkilic/application/bankai && source venv/bin/activate && PYTHONUNBUFFERED=1 python app.py
```

### Environment Details
- Operating System: macOS (Darwin 24.3.0)
- Shell: /bin/zsh
- Default Port: 8000
- Host: 0.0.0.0 (accessible from all network interfaces)

---

This document explains the Bankai document QA system, its architecture, and the technologies used to implement natural language question-answering capabilities for document content. 
