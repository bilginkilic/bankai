document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const uploadButton = document.getElementById('uploadButton');
    const uploadStatus = document.getElementById('uploadStatus');
    const questionInput = document.getElementById('questionInput');
    const askButton = document.getElementById('askButton');
    const answerSection = document.getElementById('answerSection');
    const answerContent = document.getElementById('answerContent');
    const sources = document.getElementById('sources');
    const filesList = document.getElementById('filesList');

    // Hata mesajı gösterme fonksiyonu
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    // Dosya yükleme işlemleri
    uploadButton.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', async function() {
        const file = this.files[0];
        if (!file) return;

        // Dosya tipi kontrolü
        const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!validTypes.includes(file.type)) {
            showError('Lütfen PDF veya Word dosyası yükleyin');
            return;
        }

        // Dosya boyutu kontrolü (100MB)
        if (file.size > 100 * 1024 * 1024) {
            showError('Dosya boyutu çok büyük. Maksimum 100MB yükleyebilirsiniz.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        uploadButton.disabled = true;
        uploadStatus.textContent = 'Yükleniyor...';

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (response.ok) {
                uploadStatus.textContent = data.message;
                updateFilesList(); // Dosya listesini güncelle
            } else {
                showError(data.error || 'Dosya yüklenirken bir hata oluştu');
            }
        } catch (error) {
            console.error('Yükleme hatası:', error);
            showError('Dosya yüklenirken bir hata oluştu');
        } finally {
            uploadButton.disabled = false;
            this.value = ''; // Input'u temizle
        }
    });

    // Dosya boyutunu formatla
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Dosya listesini güncelleme fonksiyonu
    function updateFilesList() {
        fetch('/files')
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.error || 'Dosya listesi alınamadı');
                    });
                }
                return response.json();
            })
            .then(data => {
                const tbody = document.querySelector('#filesTable tbody');
                if (!tbody) {
                    console.error('Dosya tablosu bulunamadı');
                    return;
                }
                
                tbody.innerHTML = '';
                
                if (!data.files || data.files.length === 0) {
                    const row = document.createElement('tr');
                    row.innerHTML = '<td colspan="3" class="px-6 py-4 text-center text-gray-500">Henüz dosya yüklenmemiş</td>';
                    tbody.appendChild(row);
                    return;
                }
                
                data.files.forEach(file => {
                    const row = document.createElement('tr');
                    const statusClass = file.status === 'processed' ? 'bg-green-100 text-green-800' : 
                                      file.status === 'error' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800';
                    
                    row.innerHTML = `
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${file.name}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                                ${file.status === 'processed' ? 'İşlendi' : 
                                  file.status === 'error' ? 'Hata' : 'Bekliyor'}
                            </span>
                            ${file.error ? `<div class="text-xs text-red-600 mt-1">${file.error}</div>` : ''}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${formatFileSize(file.size)}
                        </td>
                    `;
                    tbody.appendChild(row);
                });
            })
            .catch(error => {
                console.error('Dosya listesi hatası:', error);
                showError(error.message || 'Dosya listesi alınamadı');
            });
    }

    // Tüm dosyaları silme fonksiyonu
    async function clearAllFiles() {
        if (!confirm('Tüm dosyaları silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
            return;
        }

        try {
            const response = await fetch('/clear', {
                method: 'POST'
            });

            const data = await response.json();
            if (response.ok) {
                showError('Tüm dosyalar başarıyla silindi');
                updateFilesList(); // Dosya listesini güncelle
            } else {
                showError(data.error || 'Dosyalar silinirken bir hata oluştu');
            }
        } catch (error) {
            console.error('Dosya silme hatası:', error);
            showError('Dosyalar silinirken bir hata oluştu');
        }
    }

    // Sayfa yüklendiğinde ve her 5 saniyede bir dosya listesini güncelle
    updateFilesList();
    setInterval(updateFilesList, 5000);

    // Tüm dosyaları silme butonu ekle
    const clearButton = document.createElement('button');
    clearButton.className = 'bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-4';
    clearButton.textContent = 'Tüm Dosyaları Sil';
    clearButton.onclick = clearAllFiles;
    document.querySelector('.flex.items-center.space-x-4').appendChild(clearButton);

    // Soru sorma işlemi
    askButton.addEventListener('click', async function() {
        const question = questionInput.value.trim();
        if (!question) {
            showError('Lütfen bir soru girin');
            return;
        }

        askButton.disabled = true;
        askButton.textContent = 'İşleniyor...';
        answerSection.classList.add('hidden');
        answerContent.textContent = '';

        try {
            const response = await fetch('/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question })
            });

            const data = await response.json();
            if (response.ok) {
                answerContent.textContent = data.answer;
                answerSection.classList.remove('hidden');
            } else {
                showError(data.error || 'Soru yanıtlanırken bir hata oluştu');
            }
        } catch (error) {
            console.error('Soru sorma hatası:', error);
            showError('Soru sorulurken bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            askButton.disabled = false;
            askButton.textContent = 'Soru Sor';
        }
    });
}); 