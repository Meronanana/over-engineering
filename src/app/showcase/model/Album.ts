class Album {
  title: string;
  jacketImage: string;
  description: string;
  link: string;

  constructor(
    title: string,
    jacketImage: string,
    description: string,
    link: string
  ) {
    this.title = title;
    this.jacketImage = jacketImage;
    this.description = description;
    this.link = link;
  }
}
