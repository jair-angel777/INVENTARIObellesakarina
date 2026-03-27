from pypdf import PdfReader

reader = PdfReader("inventario v4.pdf")
text = ""
for page in reader.pages:
    text += page.extract_text() + "\n"

with open("pdf_content.txt", "w", encoding="utf-8") as f:
    f.write(text)

print("Text extracted successfully to pdf_content.txt")
