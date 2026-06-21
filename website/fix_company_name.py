import os

BASE = 'd:/my-projects/bangnida/website'
OLD = 'BANGNIDA\n          <span>Precision CNC Machining</span>'
NEW = 'BANGNIDA\n          <span>Bangnida (Zhangzhou) Intelligent Technology Co., Ltd.</span>'

# Also fix footer
OLD_FOOTER = '"Precision CNC Machining</span>'
NEW_FOOTER = '"Bangnida (Zhangzhou) Intelligent Technology Co., Ltd.</span>'

FILES = [
    'about.html', 'materials.html', 'faq.html', 'contact.html',
    'get-quote.html', 'case-studies.html',
    'capabilities/cnc-milling.html', 'capabilities/cnc-turning.html',
    'capabilities/5-axis-machining.html', 'capabilities/swiss-machining.html',
    'capabilities/surface-finishing.html',
    'industries/aerospace.html', 'industries/automotive.html',
    'industries/medical-devices.html', 'industries/industrial-equipment.html',
    'products/aerospace-bracket.html', 'products/medical-implant.html',
    'products/valve-body.html', 'products/cylinder-head.html',
    'products/drive-shaft.html', 'products/aluminum-enclosure.html',
]

for fname in FILES:
    fpath = os.path.join(BASE, fname)
    if not os.path.exists(fpath):
        print(f'NOT FOUND: {fname}')
        continue
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    changed = False
    if OLD in content:
        content = content.replace(OLD, NEW)
        changed = True
    if OLD_FOOTER in content:
        content = content.replace(OLD_FOOTER, NEW_FOOTER)
        changed = True

    if changed:
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'✅ {fname}')
    else:
        print(f'⏭️ {fname} (no match)')

print('Done!')
