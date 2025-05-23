import ComicHunt from '../components/comichunt';
import Header from '../components/Header';
import Image from 'next/image';
import LatestComics from '../components/latestcomics';
import Footer from '../components/Footer';


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
                />
              </div>

              <div className="intro-text">
                <h1 className="intro-heading">Find, Log, Store</h1>
                <h2 className="intro-subheading">Welcome to ComicHunt</h2>
                <p className="intro-tagline">A Visual Archive For All Your Comics</p>
              </div>
            </div>
          </div>
        </section>

        {/* Store Section */}
        <section className="home-section left">
          <div className="sectionBox">
            <div className="image-wrapper">
              <Image
                src="/images/AH2.svg"
                alt="Marvel Comic Character - Agatha Harkness"
                fill
              />
            </div>

            <div className="image-wrapper">
              <Image
                src="/images/yourcomics.png"
                alt="Image of the Comics page users can explore"
                fill
              />
            </div>

            <div className="section-text">
              <h1>Store your comics</h1>
              <h3>
                At ComicHunt, we know that comic collecting is more than just a hobby—it's a passion. Our intuitive database allows you to easily log and manage your entire collection, while also contributing to a growing community of fellow collectors.
              </h3>
              <h3>
                Whether you're tracking individual issues, organizing by series, or tagging storage locations like short and long boxes, ComicHunt is designed to reflect the way you collect in the real world. You can even flag missing issues or curate your own custom groups to keep everything in order.
              </h3>
            </div>
          </div>
        </section>

        {/* Dynamic Visual Analytics Section */}
        <section className="home-section right">
          <div className="sectionBox">
            <div className="image-wrapper">
              <Image
                src="/images/indexdp.png"
                alt="Image of analytics view"
                fill
              />
            </div>

            <div className="section-text">
              <h1>Dynamic Visual Analytics</h1>
              <h3>
                At ComicHunt, we know that comic collecting is more than just a hobby—it's a passion. Our intuitive database allows you to easily log and manage your entire collection, while also contributing to a growing community of fellow collectors.
              </h3>
              <h3>
                Whether you're tracking individual issues, organizing by series, or tagging storage locations like short and long boxes, ComicHunt is designed to reflect the way you collect in the real world. You can even flag missing issues or curate your own custom groups to keep everything in order.
              </h3>
               <p>
                    This web appliacation was created to allow you to explore your comics through visual components, focusing on the artwork first instead of just providing you with numerical analysis, once you've saved some comics head into the modeler and viewer to begin exploring your collection!
                                  </p>
            </div>

            <div className="image-wrapper">
              <Image
                src="/images/AH2.svg"
                alt="Comic Character - Agatha Harkness"
                fill
              />
            </div>
          </div>
        </section>

        {/* Comic Vine API Section */}
        <section className="home-section left">
          <div className="sectionBox">
            <div className="image-wrapper">
              <Image
                src="/images/CVlogo.png"
                alt="Comic Vine logo"
                fill
              />
            </div>

            <div className="section-text">
              <h1>Built using the Comic Vine API</h1>
              <h3>
                At ComicHunt, we know that comic collecting is more than just a hobby—it's a passion. Our intuitive database allows you to easily log and manage your entire collection, while also contributing to a growing community of fellow collectors.
              </h3>
              <h3>
                Whether you're tracking individual issues, organizing by series, or tagging storage locations like short and long boxes, ComicHunt is designed to reflect the way you collect in the real world. You can even flag missing issues or curate your own custom groups to keep everything in order.
              </h3>
              <p>
                Whatever your favorite comics are you can use our search bar or explore page at the header to find what you read. Just click on the comics you want to view their information and save to your hearts content!
              </p>
            </div>

            <div className="image-wrapper">
              <Image
                src="/images/CCC.svg"
                alt="Comic graphic"
                fill
              />
            </div>
          </div>
        </section>

        {/* Latest Issues */}
        <section className="home-section right">
          <div className="sectionBox">
            <div className="new-issues">
              <LatestComics />
            </div>
          </div>
        </section>

        {/* Newest Users Section */}
        <section className="home-section left">
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
              <p>This websites authentication system is powered by Firebase! Rest well knwing your information is safe and secure.</p>
            </div>

            <div className="image-wrapper">
              <Image
                src="/images/JN!.svg"
                alt="Comic Graphic - Join Now"
                fill
              />
            </div>
          </div>
        </section>
          <div>
                      <Footer />
                    </div>
      </main>
    </div>
  );
}
