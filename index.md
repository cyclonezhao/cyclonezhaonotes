<ul>
  {% for post in site.posts %}
    <li>
      <p>{{ post.url }}</p>
      <p>{{ site.github.repository_name }}</p>
      <p>{{ site.github.repository_name }}{{ post.url }}</p>
      <p>{{ site.baseurl }}{{ post.url }}</p>
      <p>cyclonezhaonotes/{{ post.url }}</p>
      <a href="{{ post.url }}">{{ post.title }}</a>
      <a href="{{ site.github.repository_name }}{{ post.url }}">{{ post.title }}</a>
      <a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>