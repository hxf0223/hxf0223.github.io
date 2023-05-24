# Python 计算文件的 MD5

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import hashlib

def hashfile(filename:str):
    with open(filename, "rb") as f:
        buf = f.read()
    m = hashlib.md5(buf)
    return m.hexdigest()

def hashfile2(filename:str):
		'''采用分块读取方式'''
    m = hashlib.md5()
    with open(filename, 'rb') as f:
        for chunk in iter(lambda: f.read(4096), b''):
            m.update(chunk)
    return m.hexdigest()
```
