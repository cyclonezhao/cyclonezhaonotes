<ul>
  {% for post in site.posts %}
    <li>
      <p>{{ post.url }}</p>
      <p>{{ site.github.repository_name }}</p>
      <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>