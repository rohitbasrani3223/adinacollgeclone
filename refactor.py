with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

header_end = content.find('<div data-elementor-type="wp-page"')
footer_start = content.find('<div data-elementor-type="footer"')

if header_end != -1 and footer_start != -1:
    header = content[:header_end]
    footer = content[footer_start:]
    
    # Extract Contact & Admissions Section
    contact_start = content.find('<!-- Contact & Admissions Section -->')
    contact_end = content.find('<!-- Modern UI Additions -->')
    
    if contact_start != -1 and contact_end != -1:
        contact_section = content[contact_start:contact_end]
        
        # New contact.html content
        contact_html = header + '<div data-elementor-type="wp-page">\n' + contact_section + '</div>\n' + footer
        
        # Replace "index.html#contact-admissions" with "contact.html" in contact.html
        contact_html = contact_html.replace('index.html#contact-admissions', 'contact.html')
        contact_html = contact_html.replace('<title>Adina Group of Institutions</title>', '<title>Contact Us - Adina Group of Institutions</title>')
        
        with open('contact.html', 'w', encoding='utf-8') as f:
            f.write(contact_html)
            
        # Update index.html: remove contact section and update links
        index_html = content[:contact_start] + content[contact_end:]
        index_html = index_html.replace('index.html#contact-admissions', 'contact.html')
        
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(index_html)
            
        print("Successfully updated index.html and created contact.html")
    else:
        print("Contact section not found.")
else:
    print("Header or Footer markers not found.")
