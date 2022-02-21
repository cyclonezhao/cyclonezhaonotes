<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ site.github.owner_name }}{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>