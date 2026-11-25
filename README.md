# REDDEQ // NEXUS OS v0.3

Два независимых статических портфолио с общей полноэкранной консолью.

## Запуск
```sh
python -m http.server 8000
```
- http://localhost:8000/ — шлюз выбора специализации
- http://localhost:8000/dtp/ — DTP Archive: HOME, WORKS, SKILLS, WORKFLOW, CONTACT
- http://localhost:8000/automation/ — Toolchain: HOME, PROJECTS, STACK, LABORATORY, CONTACT

Без сборки и зависимостей. index.html, dtp/index.html и automation/index.html — независимые HTML-страницы с собственными метаданными. styles.css и app.js общие. Ссылки относительные, подходят для project site GitHub Pages.

## Навигация
Внутри каждого пространства используется hash-навигация. Например /dtp/#apo100 и /automation/#pdfconverter открывают карточки кейсов. Старые ссылки /#apo100 и /#pdfconverter перенаправляются в соответствующие пространства при включённом JS. Через NEXUS можно сменить специализацию. Команды help и ls показывают доступные модули; dtp/dev/nexus переключают пространства (nexus — из специализированных страниц). Netrunner-режим сохраняется между страницами; при reduced motion анимации отключены. Без JS все материалы доступны на соответствующей странице с обычной прокруткой.

## GitHub Pages
Для публикации на GitHub Free необходим публичный репозиторий. После проверки материалов и истории Git: Settings → Pages → Deploy from a branch → main / (root).
Адреса: https://reddeq.github.io/portfolio/ , https://reddeq.github.io/portfolio/dtp/ , https://reddeq.github.io/portfolio/automation/ .
Публикация и видимость репозитория не менялись.

## Материалы
Не добавлять исходные клиентские документы и персональные данные. Пока используются условные графические карточки и описания девяти существующих проектов. Специализированные PDF, контактные данные и согласованные превью ещё предстоит добавить.

## Проверка
Проверить все три URL, перезагрузку прямых ссылок, Back/Forward, быстрые переключения, режимы Netrunner/Standard, reduced motion, клавиатуру, мобильный экран и отсутствие JS. DTP не должен содержать личных проектов и инструментов автоматизации.
