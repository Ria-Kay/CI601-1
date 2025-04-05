import ComicHunt from '../components/comichunt';
import Header from '../components/Header';
import Image from 'next/image';
import LatestComics from '../components/latestcomics';

export default function Home() {
  return (
    <div>
      <ComicHunt />
      <Header />

      <main>
        {/* Welcome Section */}
        <section className="home-section intro-section">
  <div className="sectionBox introBox">
    <div className="intro-content">
      <div className="image-wrapper logo-large">

<Image
  src="/images/updatedlogo.svg"
  alt="ComicHunt logo"
  width={320}
  height={320}
  className="biglogo"
/>      </div>

      <div className="intro-text">
        <h1 className="intro-heading">Find, Log, Store</h1>
        <h2 className="intro-subheading">Welcome to ComicHunt</h2>
        <p className="intro-tagline">A Visual Archive For All Your Comics</p>
      </div>
    </div>
  </div>
</section>



        {/* Store Section (Agatha Harkness) */}
        <section className="home-section">
          <div className="sectionBox">
            <div className="image-wrapper">
              <Image
                src="/images/Agatha_Harkness_29.png"
                alt="Comic Character - Agatha Harkness"
                fill
              />
            </div>

            <div className="section-text">
              <h1>Store your comics</h1>
              <h3>
              At ComicHunt, we know that comic collecting is more than just a hobby—it's a passion. Our intuitive database allows you to easily log and manage your entire collection, while also contributing to a growing community of fellow collectors.              </h3>
              <h3>
              Whether you're tracking individual issues, organizing by series, or tagging storage locations like short and long boxes, ComicHunt is designed to reflect the way you collect in the real world. You can even flag missing issues or curate your own custom groups to keep everything in order.              </h3>
            </div>
          </div>
        </section>

        {/* Latest Issues Section */}
        <section className="home-section">
        <div className="sectionBox">
        <div className= "new-issues">
            <LatestComics />
        </div>
        </div>
        </section>

        {/* New Users Section */}
        <section className="home-section">
          <div className="sectionBox">
            <div className="image-wrapper">
              <Image
                src="/images/nightwing_dick_grayson_render_png_by_marcopolo157_diofugo-pre.png"
                alt="Comic Char_D.G"
                fill
              />
            </div>

            <div className="section-text">
              <h1>Newest Members</h1>
              <h3>
                Welcome our latest comic hunters to the community! Sign up and see who else shares your favorite series, or discover what your fellow fans are reading.
              </h3>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
