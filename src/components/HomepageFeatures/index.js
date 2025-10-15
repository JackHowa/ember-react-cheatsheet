import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Use common vocab from Ember',
    Svg: require('@site/static/img/undraw_camping.svg').default,
    description: (
      <>
        Ember terms are also used and explained in this migration docs site. It's easier to migrate what you can understand.
      </>
    ),
  },
  {
    title: 'Learn React with examples',
    Svg: require('@site/static/img/undraw_react.svg').default,
    description: (
      <>
        Seeing common usages of React can help learn rather than knowing the theory alone.
      </>
    ),
  },
  {
    title: 'Docs Powered by React',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Extend or customize your website layout by reusing React. This Docusaurus site can be used to practice React!
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h2">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
