import os

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Header: from start to end of header element
header_start_tag = '<div data-elementor-type="header"'
header_start_idx = content.find(header_start_tag)

if header_start_idx == -1:
    print("Header tag not found")
    exit(1)

# Find the matching closing div for the header
count = 0
header_end_idx = -1
for i in range(header_start_idx, len(content)):
    if content[i:i+4] == '<div':
        count += 1
    elif content[i:i+5] == '</div':
        count -= 1
        if count == 0:
            header_end_idx = i + 6 # Include </div>
            break

if header_end_idx == -1:
    print("Header end not found")
    exit(1)

header_block = content[:header_end_idx]

# Footer: from start of footer element to end of file
footer_start_tag = '<div data-elementor-type="footer"'
footer_start_idx = content.find(footer_start_tag)

if footer_start_idx == -1:
    print("Footer tag not found")
    exit(1)

footer_block = content[footer_start_idx:]

# Contact Section
contact_start_marker = '<!-- Contact & Admissions Section -->'
contact_end_marker = '<!-- Modern UI Additions -->'
contact_start_idx = content.find(contact_start_marker)
contact_end_idx = content.find(contact_end_marker)

if contact_start_idx == -1 or contact_end_idx == -1:
    print("Contact section markers not found")
    exit(1)

contact_section = content[contact_start_idx:contact_end_idx]

# Create contact.html
# Use a cleaner structure similar to other pages
contact_html = header_block + '\n<div class="contact-page-content">\n' + contact_section + '\n</div>\n' + footer_block

# Update links and title
contact_html = contact_html.replace('index.html#contact-admissions', 'contact.html')
contact_html = contact_html.replace('<title>Home -</title>', '<title>Contact Us - Adina Group of Institutions</title>')
contact_html = contact_html.replace('<body class="home', '<body class="page contact-page')

with open('contact.html', 'w', encoding='utf-8') as f:
    f.write(contact_html)

# Update index.html
new_index = content[:contact_start_idx] + content[contact_end_idx:]
new_index = new_index.replace('index.html#contact-admissions', 'contact.html')
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_index)

print("Success")
