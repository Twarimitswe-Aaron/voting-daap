import re

with open('/media/newvolume/Documents/Notes2/Web3/SolidityCodes/Scholarship/voting-dapp/Lab_Manual_Answers.md', 'r') as f:
    lines = f.readlines()

html_output = '    <div class="qa-section">\n        <h2>Lab Manual: Complete Questions & Answers</h2>\n'

i = 0
while i < len(lines):
    line = lines[i].strip()
    if line.startswith('## '):
        html_output += f'        <h3 style="margin-top: 20px;">{line[3:]}</h3>\n'
    elif re.match(r'^\d+\.\s\*\*(.*)\*\*$', line):
        question = re.match(r'^\d+\.\s\*\*(.*)\*\*$', line).group(0).replace('**', '')
        # the next line might be the answer
        i += 1
        if i < len(lines):
            answer = lines[i].strip()
            while i+1 < len(lines) and lines[i+1].strip() != "" and not lines[i+1].startswith('##') and not re.match(r'^\d+\.\s\*\*(.*)\*\*$', lines[i+1].strip()):
                i += 1
                answer += " " + lines[i].strip()
            
            html_output += f'''        <details class="qa-item" style="margin-bottom: 10px; padding: 10px; background: white; border: 1px solid #ddd; border-radius: 5px;">
            <summary class="question" style="cursor: pointer; font-weight: bold;">{question}</summary>
            <div class="answer" style="margin-top: 10px; padding-left: 15px; color: #555;">{answer}</div>
        </details>\n'''
    i += 1

html_output += '    </div>'

with open('/media/newvolume/Documents/Notes2/Web3/SolidityCodes/Scholarship/voting-dapp/client/index.html', 'r') as f:
    content = f.read()

start_idx = content.find('<div class="qa-section">')
end_idx = content.find('</body>')

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + html_output + '\n' + content[end_idx:]
    with open('/media/newvolume/Documents/Notes2/Web3/SolidityCodes/Scholarship/voting-dapp/client/index.html', 'w') as f:
        f.write(new_content)
    print("Replaced successfully")
else:
    print("Could not find boundaries")
