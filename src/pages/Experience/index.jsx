import React from 'react';
import Layout from '../../components/Layout';
import styles from './index.module.scss';

const Experience = () => {
  return (
    <Layout>
      <div className={styles.experience}>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroContent}>
              <p className={styles.heroEyebrow}>King & Carter Experiences</p>
              <h1 className={styles.heroTitle}>
                <span>Expect the best.</span>
                <br />
                <span>Experience better.</span>
              </h1>
              <p className={styles.heroSubtitle}>
                For discerning individuals and businesses seeking thoughtful, worldwide concierge
                support, curated access, and experiences shaped around how you actually live.
              </p>
              <div className={styles.heroActions}>
                <button type="button" className={styles.primaryCta}>
                  Become a member
                </button>
                <button type="button" className={styles.secondaryCta}>
                  Explore business services
                </button>
              </div>
            </div>
            <div className={styles.heroImageWrapper}>
              <img
                src="/image/mlswdjno-cf5rp6i.png"
                alt="Guest overlooking a scenic landscape"
                className={styles.heroImage}
              />
            </div>
          </div>
        </section>

        <section className={styles.highlightGrid}>
          <div className={styles.frame5}>
            <div className={styles.frame4}>
              <div className={styles.vector11}>
                <div className={styles.frame3}>
                  <img
                    src="/image/mlswdjno-kfk5v5z.png"
                    className={styles.image2}
                    alt="Private membership"
                  />
                </div>
                <p className={styles.privateMembership}>Private membership</p>
                <div className={styles.autoWrapper11}>
                  <p className={styles.bespokeConciergeAndL3}>
                    <span className={styles.bespokeConciergeAndL}>
                      Bespoke concierge and lifestyle management
                      <br />
                    </span>
                    <span className={styles.bespokeConciergeAndL2}>
                      services for discerning individuals.
                    </span>
                  </p>
                </div>
                <p className={styles.personalisedOneToOne2}>
                  <span className={styles.bespokeConciergeAndL}>
                    Personalised, one-to-one attention and access to the
                    <br />
                  </span>
                  <span className={styles.personalisedOneToOne}>
                    inaccessible, giving back the invaluable gift of time.
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className={styles.frame7}>
            <div className={styles.frame6}>
              <div className={styles.vector14}>
                <div className={styles.frame3}>
                  <img
                    src="/image/mlswdjno-2xyle19.png"
                    className={styles.image2}
                    alt="Corporate membership"
                  />
                </div>
                <p className={styles.privateMembership}>Corporate membership</p>
                <div className={styles.groups6}>
                  <p className={styles.extendingOurServiceB3}>
                    <span className={styles.extendingOurServiceB}>
                      Extending our service beyond individuals, we help brands
                      <br />
                    </span>
                    <span className={styles.bespokeConciergeAndL2}>
                      and businesses better serve and connect with their
                      <br />
                    </span>
                    <span className={styles.extendingOurServiceB2}>
                      most valued audiences.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.frame13}>
            <div className={styles.frame9}>
              <div className={styles.vector16}>
                <div className={styles.autoWrapper14}>
                  <p className={styles.consistentlyConnecte2}>
                    <span className={styles.extendingOurServiceB}>
                      Consistently connected to the most important
                      <br />
                    </span>
                    <span className={styles.consistentlyConnecte}>
                      global happenings.
                    </span>
                  </p>
                </div>
                <div className={styles.autoWrapper15}>
                  <p className={styles.editorial}>Editorial</p>
                  <div className={styles.frame8}>
                    <p className={styles.thePulseDiscoverWhat}>
                      Discover what’s new and now worldwide with our editorial
                      section, Noted.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.membershipSection}>
          <h2 className={styles.sectionHeading}>Membership services</h2>
          <div className={styles.cardGrid}>
            <div className={styles.groups9}>
              <div className={styles.vector18}>
                <img src="/image/mlswdjno-4b312zc.png" className={styles.image2} alt="Travel" />
                <p className={styles.travel}>Travel</p>
                <p className={styles.ourAwardWinningInHou2}>
                  <span className={styles.extendingOurServiceB}>
                    Our award-winning in-house travel agency crafts
                    <br />
                  </span>
                  <span className={styles.bespokeConciergeAndL2}>
                    itineraries tailored to your preferences and pace.
                  </span>
                </p>
              </div>
            </div>
            <div className={styles.groups10}>
              <div className={styles.vector19}>
                <p className={styles.restaurantsNightlife}>Restaurants & nightlife</p>
                <p className={styles.estaurantsEnableExcl}>
                  <span className={styles.bespokeConciergeAndL}>
                    Relationships with the world’s best chefs and venues
                    <br />
                  </span>
                  <span className={styles.personalisedOneToOne}>
                    unlock exclusive tables and new discoveries.
                  </span>
                </p>
              </div>
              <img src="/image/mlswdjno-3sk9bmf.png" className={styles.image5} alt="Dining" />
            </div>
            <div className={styles.groups13}>
              <div className={styles.vector22}>
                <p className={styles.exclusiveAccess}>Exclusive access</p>
                <p className={styles.recedentedAccessToCo2}>
                  <span className={styles.extendingOurServiceB}>
                    Unprecedented access to coveted global happenings,
                    <br />
                  </span>
                  <span className={styles.recedentedAccessToCo}>
                    from sport to entertainment to art.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.businessSection}>
          <h2 className={styles.sectionHeading}>Business services</h2>
          <div className={styles.cardGrid}>
            <div className={styles.groups16}>
              <div className={styles.vector26}>
                <img
                  src="/image/mlswdjno-on23b63.png"
                  className={styles.image2}
                  alt="Corporate membership"
                />
                <p className={styles.privateMembership}>Corporate membership</p>
                <div className={styles.groups15}>
                  <p className={styles.bespokeComprehensive}>
                    <span className={styles.extendingOurServiceB}>
                      Comprehensive lifestyle support for senior leaders,
                      <br />
                    </span>
                    <span className={styles.bespokeConciergeAndL2}>
                      with unlimited access to our global offering.
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.groups17}>
              <div className={styles.vector27}>
                <p className={styles.brandEventsExperienc3}>
                  <span className={styles.brandEventsExperienc}>Brand events &amp; </span>
                  <span className={styles.brandEventsExperienc2}>experiences</span>
                </p>
                <p className={styles.quintessentiallyExpe2}>
                  <span className={styles.extendingOurServiceB}>
                    Experiences that build lasting connections between
                    <br />
                  </span>
                  <span className={styles.bespokeConciergeAndL2}>
                    luxury brands and high-value audiences.
                  </span>
                </p>
              </div>
              <img src="/image/mlswdjno-5q076de.png" className={styles.image7} alt="Events" />
            </div>
            <div className={styles.groups20}>
              <div className={styles.vector30}>
                <img
                  src="/image/mlswdjno-0ne0b2g.png"
                  className={styles.image2}
                  alt="Private events"
                />
                <p className={styles.privateEvents}>Private events</p>
                <div className={styles.groups18}>
                  <p className={styles.weProvideEndToEndEve3}>
                    <span className={styles.extendingOurServiceB}>
                      End-to-end planning for unforgettable occasions,
                      <br />
                    </span>
                    <span className={styles.weProvideEndToEndEve}>
                      delivered with precision and discretion.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.testimonialSection}>
          <div className={styles.vector38}>
            <p className={styles.hereSWhatOurMembersH}>
              Here's what our members have to say
            </p>
            <div className={styles.frame18}>
              <p className={styles.aWeWantedToTakeAMome}>
                ‘We wanted to take a moment to express our heartfelt gratitude to you for
                your tireless efforts in making our trip truly exceptional.’
              </p>
            </div>
            <p className={styles.planningOurItinerary3}>
              Planning our itinerary was so impressive, and your care and dedication in
              putting everything together were immensely appreciated.
            </p>
          </div>
        </section>

        <section className={styles.enquirySection}>
          <div className={styles.groups32}>
            <div className={styles.frame2}>
              <div className={styles.image}>
              <p className={styles.wantToEnquireAboutPr4}>
                <span className={styles.wantToEnquireAboutPr}>W</span>
                <span className={styles.wantToEnquireAboutPr2}>
                  ant to enquire about private membership?
                  <br />
                </span>
                <span className={styles.wantToEnquireAboutPr3}>
                  Fill out the form below.
                </span>
              </p>
              <p className={styles.forAllOtherEnquiries}>
                For all other enquiries, click here.
              </p>
              <div className={styles.vector} />
              <div className={styles.autoWrapper}>
                <p className={styles.salutation}>Salutation</p>
                <img src="/image/mlswdjmu-m40epd7.png" className={styles.groups} alt="icon" />
              </div>
              <div className={styles.vector2} />
              <div className={styles.autoWrapper2}>
                <p className={styles.salutation}>First name *</p>
                <p className={styles.salutation}>Last name *</p>
              </div>
              <div className={styles.autoWrapper3}>
                <div className={styles.vector3} />
                <div className={styles.vector3} />
              </div>
              <div className={styles.autoWrapper4}>
                <p className={styles.salutation}>Country of residence *</p>
                <img src="/image/mlswdjmu-m40epd7.png" className={styles.groups} alt="icon" />
              </div>
              <div className={styles.vector2} />
              <p className={styles.emailAddress}>Email address *</p>
              <div className={styles.vector2} />
              <div className={styles.autoWrapper5}>
                <p className={styles.a233Ghana}>(+233) Ghana</p>
                <img src="/image/mlswdjmu-m40epd7.png" className={styles.groups2} alt="icon" />
                <p className={styles.phoneNumber}>Phone number *</p>
              </div>
              <div className={styles.autoWrapper3}>
                <div className={styles.vector3} />
                <div className={styles.vector3} />
              </div>
              <div className={styles.frame}>
                <p className={styles.howDidYouHearAboutUs}>
                  How did you hear about us?
                </p>
              </div>
              <div className={styles.vector4} />
              <p className={styles.letUsKnowHowWeCanHel}>
                Let us know how we can help you… *
              </p>
              <div className={styles.vector5} />
              <div className={styles.autoWrapper6}>
                <img src="/image/mlswdjmv-fywl9gs.svg" className={styles.vector6} alt="checkbox" />
                <p className={styles.iWouldLikeToSubscrib}>
                  I would like to subscribe to Quintessentially's Noted Newsletter
                </p>
              </div>
              <div className={styles.autoWrapper9}>
                <img src="/image/mlswdjmv-fywl9gs.svg" className={styles.vector6} alt="checkbox" />
                <div className={styles.autoWrapper8}>
                  <p className={styles.iConRmThatIHaveReadA}>
                    I conﬁrm that I have read and agree with the Terms & Conditions
                    and Privacy Policy *
                  </p>
                  <div className={styles.autoWrapper7}>
                    <div className={styles.vector7} />
                    <img
                      src="/image/mlswdjmv-i7idnix.svg"
                      className={styles.vector8}
                      alt="arrow"
                    />
                  </div>
                </div>
              </div>
              <p className={styles.aIndicatesRequiredEl}>* Indicates required ﬁeld</p>
              <div className={styles.autoWrapper10}>
                <img src="/image/mlswdjmv-pa9u448.svg" className={styles.groups3} alt="btn" />
                <div className={styles.vector9}>
                  <p className={styles.submit}>Submit</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </section>

        <div className={styles.groups14}>
          <div className={styles.frame15}>
            <div className={styles.vector23} />
            <div className={styles.frame14}>
              <img src="/image/mlswdjno-v36aflj.png" className={styles.image2} alt="img" />
            </div>
          </div>
        </div>
        <img src="/image/mlswdjmw-hgyupnu.svg" className={styles.groups31} alt="img" />
        <div className={styles.frame24}>
          <p className={styles.makeAnEnquiry}>Make an enquiry</p>
        </div>
      </div>
    </Layout>
  );
}

export default Experience;
