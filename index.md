<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ site.github.repository_name }}/{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>