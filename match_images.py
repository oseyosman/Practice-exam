#!/usr/bin/env python3
"""
Match images in /images folder to questions in questions.js by question number.

Rules:
- q3.jpeg         => question q-jc-3  => "image" field
- q8-a.png        => question q-jc-8  => goes into "image" array (question images)
- q120-1.jpeg     => question q-jc-120 => "image" array (multiple question images)
- q121-Answer.jpeg => question q-jc-121 => "answerImage" field
- q123-Answer-2.jpeg => question q-jc-123 => "answerImage" array
"""

import os
import re
import json
from collections import defaultdict

IMAGES_DIR = "images"
JS_FILE = "questions.js"

def get_image_files():
    files = os.listdir(IMAGES_DIR)
    return sorted(files)

def parse_image_filename(filename):
    name, ext = os.path.splitext(filename)
    
    # Pattern: q<N>-Answer-<M>   e.g. q123-Answer-2
    m = re.match(r'^q(\d+)-[Aa]nswer-\d+$', name, re.IGNORECASE)
    if m:
        return (int(m.group(1)), 'answer', filename)
    
    # Pattern: q<N>-Answer2, q<N>-Answer3  e.g. q323-Answer2
    m = re.match(r'^q(\d+)-[Aa]nswer\d*$', name, re.IGNORECASE)
    if m:
        return (int(m.group(1)), 'answer', filename)
    
    # Pattern: q<N>-<M>   e.g. q120-1, q8-a, q8-b
    m = re.match(r'^q(\d+)-(.+)$', name, re.IGNORECASE)
    if m:
        return (int(m.group(1)), 'question', filename)
    
    # Pattern: q<N>   simple single image  e.g. q3, q28
    m = re.match(r'^q(\d+)$', name)
    if m:
        return (int(m.group(1)), 'single', filename)
    
    return None

def group_images():
    files = get_image_files()
    groups = defaultdict(lambda: {'single': None, 'question': [], 'answer': []})
    
    for filename in files:
        parsed = parse_image_filename(filename)
        if parsed is None:
            print(f"  [WARN] Could not parse: {filename}")
            continue
        
        num, kind, fname = parsed
        path = f"images/{fname}"
        
        if kind == 'single':
            groups[num]['single'] = path
        elif kind == 'question':
            groups[num]['question'].append(path)
        elif kind == 'answer':
            groups[num]['answer'].append(path)
    
    for num in groups:
        groups[num]['question'].sort()
        groups[num]['answer'].sort()
    
    return groups

def find_question_line(lines, q_num):
    target_id = f'"q-jc-{q_num}"'
    for i, line in enumerate(lines):
        if '"id":' in line and target_id in line:
            return i
    return None

def find_image_line(lines, start_idx):
    for i in range(start_idx, min(start_idx + 60, len(lines))):
        stripped = lines[i].strip()
        if stripped.startswith('"image":'):
            return i
        if i > start_idx and '"id":' in lines[i] and ('"q-jc-' in lines[i] or '"pbq-' in lines[i]):
            break
    return None

def find_field_line(lines, start_idx, field_name):
    for i in range(start_idx, min(start_idx + 60, len(lines))):
        stripped = lines[i].strip()
        if stripped.startswith(f'"{field_name}":'):
            return i
        if i > start_idx and '"id":' in lines[i] and ('"q-jc-' in lines[i] or '"pbq-' in lines[i]):
            break
    return None

def main():
    groups = group_images()
    
    print(f"Found image groups for {len(groups)} questions:")
    for num in sorted(groups.keys()):
        g = groups[num]
        print(f"  Q{num}: single={g['single']}, question_imgs={len(g['question'])}, answer_imgs={len(g['answer'])}")
    
    print(f"\nReading {JS_FILE}...")
    with open(JS_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    lines = content.split('\n')
    
    changed = 0
    skipped = []
    
    for q_num in sorted(groups.keys()):
        g = groups[q_num]
        
        q_line_idx = find_question_line(lines, q_num)
        if q_line_idx is None:
            skipped.append(f"Q{q_num}: question id 'q-jc-{q_num}' not found in file")
            continue
        
        # Handle "image" field
        image_line_idx = find_image_line(lines, q_line_idx)
        
        if image_line_idx is None:
            skipped.append(f"Q{q_num}: 'image' field not found near line {q_line_idx+1}")
            continue
        
        if g['single']:
            new_image_val = json.dumps(g['single'])
            new_image_line = f'    "image": {new_image_val}'
            # Preserve trailing comma
            if lines[image_line_idx].rstrip().endswith(','):
                new_image_line += ','
            lines[image_line_idx] = new_image_line
            changed += 1
            print(f"  OK Q{q_num}: image = {g['single']}")
        
        elif g['question']:
            img_list = g['question']
            if len(img_list) == 1:
                new_image_val = json.dumps(img_list[0])
            else:
                new_image_val = json.dumps(img_list)
            new_image_line = f'    "image": {new_image_val}'
            if lines[image_line_idx].rstrip().endswith(','):
                new_image_line += ','
            lines[image_line_idx] = new_image_line
            changed += 1
            print(f"  OK Q{q_num}: image = {img_list}")
        
        # Handle "answerImage" field
        if g['answer']:
            answer_imgs = g['answer']
            answer_img_line_idx = find_field_line(lines, q_line_idx, 'answerImage')
            
            if answer_img_line_idx is not None:
                # Update existing
                if len(answer_imgs) == 1:
                    new_val = json.dumps(answer_imgs[0])
                else:
                    new_val = json.dumps(answer_imgs)
                existing = lines[answer_img_line_idx]
                trailing = ',' if existing.rstrip().endswith(',') else ''
                lines[answer_img_line_idx] = f'    "answerImage": {new_val}{trailing}'
                changed += 1
                print(f"  OK Q{q_num}: answerImage updated = {answer_imgs}")
            else:
                # Insert after image line
                insert_after = image_line_idx
                if len(answer_imgs) == 1:
                    new_val = json.dumps(answer_imgs[0])
                else:
                    new_val = json.dumps(answer_imgs)
                # Make sure previous line has a comma
                existing_line = lines[insert_after]
                if not existing_line.rstrip().endswith(','):
                    lines[insert_after] = existing_line.rstrip() + ','
                lines.insert(insert_after + 1, f'    "answerImage": {new_val}')
                changed += 1
                print(f"  OK Q{q_num}: answerImage inserted = {answer_imgs}")
    
    print(f"\nSkipped ({len(skipped)}):")
    for s in skipped:
        print(f"  SKIP {s}")
    
    print(f"\nWriting updated file ({changed} changes)...")
    with open(JS_FILE, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    
    print("Done!")

if __name__ == '__main__':
    main()
