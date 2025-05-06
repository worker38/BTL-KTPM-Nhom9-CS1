document.getElementById('shortenForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const urlInput = document.getElementById('urlInput').value;
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    try {
        const response = await fetch('/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `url=${encodeURIComponent(urlInput)}`
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Unknown error');
        }

        const shortId = data.shortId;
        const shortUrl = `${window.location.origin}/short/${shortId}`;

        const link = document.createElement('a');
        link.href = shortUrl;
        link.target = '_blank';
        link.textContent = shortUrl;

        const copyButton = document.createElement('button');
        copyButton.textContent = 'Sao chép';

        copyButton.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(shortUrl);
                copyButton.textContent = 'Đã sao chép!';
                setTimeout(() => {
                    copyButton.textContent = 'Sao chép';
                }, 2000);
            } catch (err) {
                resultDiv.innerHTML += `<br>Error copying: ${err.message}`;
            }
        });

        resultDiv.appendChild(document.createTextNode('URL rút gọn: '));
        resultDiv.appendChild(link);
        resultDiv.appendChild(document.createTextNode(' '));
        resultDiv.appendChild(copyButton);
    } catch (error) {
        resultDiv.innerHTML = `Error: ${error.message}`;
    }
});