import requests

def upload_document(file_path):
    url = 'http://localhost:8000/upload'
    
    with open(file_path, 'rb') as f:
        files = {'file': f}
        response = requests.post(url, files=files)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

if __name__ == '__main__':
    file_path = 'context/Alice_in_Wonderland.pdf'
    upload_document(file_path) 