document.querySelector("mutation-test-report-app").report = {
  files: {
    "/Users/jmeng/Documents/code/t485/src/components/layout/Layout.tsx": {
      language: "typescript",
      mutants: [
        {
          id: "0",
          location: {
            end: { column: 2, line: 79 },
            start: { column: 101, line: 34 },
          },
          mutatorName: "BlockStatement",
          replacement: "{}",
          status: "Survived",
        },
        {
          id: "4",
          location: {
            end: { column: 44, line: 53 },
            start: { column: 43, line: 53 },
          },
          mutatorName: "EqualityOperator",
          replacement: ">=",
          status: "Survived",
        },
        {
          id: "1",
          location: {
            end: { column: 49, line: 53 },
            start: { column: 18, line: 53 },
          },
          mutatorName: "ConditionalExpression",
          replacement: "false",
          status: "Survived",
        },
        {
          id: "5",
          location: {
            end: { column: 26, line: 54 },
            start: { column: 25, line: 54 },
          },
          mutatorName: "ArithmeticOperator",
          replacement: "-",
          status: "Survived",
        },
        {
          id: "6",
          location: {
            end: { column: 24, line: 54 },
            start: { column: 21, line: 54 },
          },
          mutatorName: "StringLiteral",
          replacement: '""',
          status: "Survived",
        },
        {
          id: "7",
          location: {
            end: { column: 23, line: 55 },
            start: { column: 21, line: 55 },
          },
          mutatorName: "StringLiteral",
          replacement: '"Stryker was here!"',
          status: "Survived",
        },
        {
          id: "9",
          location: {
            end: { column: 23, line: 66 },
            start: { column: 7, line: 66 },
          },
          mutatorName: "ConditionalExpression",
          replacement: "true",
          status: "Survived",
        },
        {
          id: "8",
          location: {
            end: { column: 28, line: 55 },
            start: { column: 25, line: 55 },
          },
          mutatorName: "StringLiteral",
          replacement: '""',
          status: "Survived",
        },
        {
          id: "10",
          location: {
            end: { column: 23, line: 66 },
            start: { column: 7, line: 66 },
          },
          mutatorName: "ConditionalExpression",
          replacement: "false",
          status: "Survived",
        },
        {
          id: "11",
          location: {
            end: { column: 23, line: 66 },
            start: { column: 7, line: 66 },
          },
          mutatorName: "BooleanLiteral",
          replacement: "backgroundImage",
          status: "Survived",
        },
        {
          id: "12",
          location: {
            end: { column: 4, line: 68 },
            start: { column: 25, line: 66 },
          },
          mutatorName: "BlockStatement",
          replacement: "{}",
          status: "Survived",
        },
        {
          id: "13",
          location: {
            end: { column: 4, line: 78 },
            start: { column: 10, line: 68 },
          },
          mutatorName: "BlockStatement",
          replacement: "{}",
          status: "Survived",
        },
        {
          id: "14",
          location: {
            end: { column: 29, line: 72 },
            start: { column: 20, line: 72 },
          },
          mutatorName: "StringLiteral",
          replacement: '""',
          status: "Survived",
        },
        {
          id: "15",
          location: {
            end: { column: 33, line: 73 },
            start: { column: 16, line: 73 },
          },
          mutatorName: "ArrayDeclaration",
          replacement: "[]",
          status: "Survived",
        },
        {
          id: "2",
          location: {
            end: { column: 49, line: 53 },
            start: { column: 18, line: 53 },
          },
          mutatorName: "ConditionalExpression",
          replacement: "true",
          status: "Survived",
        },
        {
          id: "3",
          location: {
            end: { column: 44, line: 53 },
            start: { column: 43, line: 53 },
          },
          mutatorName: "EqualityOperator",
          replacement: "<=",
          status: "Survived",
        },
      ],
      source:
        '/**\n * Layout component that queries for data\n * with Gatsby\'s StaticQuery component\n *\n * See: https://www.gatsbyjs.org/docs/static-query/\n */\n\nimport React from "react"\n// import { StaticQuery, graphql } from "gatsby"\nimport { Container, Row, Col } from "react-bootstrap"\nimport Navbar from "./Navbar"\n// import styled from "styled-components"\nimport BackgroundImage from "gatsby-background-image"\nimport "../../styles/style.scss"\n\ninterface LayoutProps {\n  /**\n   * The content of the page. It will be wrapped in a contianer.\n   */\n  children: React.ReactNode;\n  /**\n   * The path to the current page. It will be used for the navbar.\n   */\n  pageName?: string;\n  /**\n   * If provided, a background image will be shown instead of the default white background color\n   */\n  backgroundImage?: string;\n  /**\n   * Whether or not to render the admin layout, which includes the special admin navbar.\n   */\n  admin?: boolean;\n}\nconst Layout = ({ children, pageName, backgroundImage, admin }: LayoutProps): React.ReactElement => {\n  const page = (\n    <>\n      <Container fluid className="px-0 main">\n        <Navbar pageName={pageName} admin={admin} />\n        <Row noGutters>\n          <Col>\n            <Container className="mt-5">\n              <main>{children}</main>\n            </Container>\n          </Col>\n        </Row>\n      </Container>\n      <Container fluid className="px-0">\n        <Row noGutters>\n          <Col className="footer-col">\n            <footer>\n              <span>\n                Copyright © 2006\n                {new Date().getFullYear() > 2006\n                  ? "-" + new Date().getFullYear()\n                  : ""}{" "}\n                Troop 485, Silicon Valley Monterey Bay Council, Boy Scouts of\n                America.\n              </span>\n            </footer>\n          </Col>\n        </Row>\n      </Container>\n    </>\n  )\n\n  if (!backgroundImage) {\n    return page;\n  } else {\n    return (\n      <BackgroundImage\n        Tag="section"\n        className={"bg-full"}\n        fluid={[backgroundImage]}\n      >\n        {page}\n      </BackgroundImage>\n    )\n  }\n}\nexport {Layout};\nexport default Layout\n',
    },
    "/Users/jmeng/Documents/code/t485/src/components/layout/Navbar.tsx": {
      language: "typescript",
      mutants: [
        {
          id: "16",
          location: {
            end: { column: 2, line: 23 },
            start: { column: 18, line: 9 },
          },
          mutatorName: "BlockStatement",
          replacement: "{}",
          status: "Survived",
        },
        {
          id: "17",
          location: {
            end: { column: 58, line: 16 },
            start: { column: 30, line: 16 },
          },
          mutatorName: "BlockStatement",
          replacement: "{}",
          status: "Survived",
        },
        {
          id: "19",
          location: {
            end: { column: 43, line: 16 },
            start: { column: 40, line: 16 },
          },
          mutatorName: "StringLiteral",
          replacement: '""',
          status: "Survived",
        },
        {
          id: "18",
          location: {
            end: { column: 45, line: 16 },
            start: { column: 44, line: 16 },
          },
          mutatorName: "ArithmeticOperator",
          replacement: "-",
          status: "Survived",
        },
        {
          id: "21",
          location: {
            end: { column: 30, line: 42 },
            start: { column: 27, line: 42 },
          },
          mutatorName: "StringLiteral",
          replacement: '""',
          status: "Survived",
        },
        {
          id: "20",
          location: {
            end: { column: 2, line: 64 },
            start: { column: 71, line: 35 },
          },
          mutatorName: "BlockStatement",
          replacement: "{}",
          status: "Survived",
        },
        {
          id: "22",
          location: {
            end: { column: 55, line: 43 },
            start: { column: 35, line: 43 },
          },
          mutatorName: "ObjectLiteral",
          replacement: "{}",
          status: "Survived",
        },
        {
          id: "23",
          location: {
            end: { column: 53, line: 43 },
            start: { column: 44, line: 43 },
          },
          mutatorName: "StringLiteral",
          replacement: '""',
          status: "Survived",
        },
      ],
      source:
        'import React, { ReactElement, ReactNode } from "react"\nimport { Link } from "gatsby"\nimport { navigate } from "gatsby-link"\nimport { Navbar as BootstrapNavbar, Nav, Button } from "react-bootstrap"\n\nfunction NavbarLink(props: {\n  page: string;\n  children: ReactNode;\n}): ReactElement {\n  // Gatsby link element doesn\'t work well with our storybook config\n  return (\n    <>\n      {/*<Link to={"/" + props.page} className="link-no-style">*/}\n      <Nav.Link\n        eventKey={props.page}\n        onClick={(): void => {navigate("/" + props.page)}}\n      >\n        {props.children}\n      </Nav.Link>\n      {/*</Link>*/}\n    </>\n  )\n}\ninterface PropDef {\n  /**\n   * The name of the page that should be active. This should be the path to the page.\n   * For example, on a page /navbarDemo, the value should be `/navbarDemo`. This is used to determine which nav link should be highlighted.\n   */\n  pageName?: string;\n  /**\n   * Whether or not the admin variant of the navbar should be rendered instead of the normal component.\n   */\n  admin?: boolean;\n}\nexport const Navbar = ({ pageName, admin }: PropDef): ReactElement => {\n  return (\n    <>\n      <BootstrapNavbar bg="dark" variant="dark" expand="lg" id="site-navbar">\n        {/* <Container> */}\n        <Link to="/" className="link-no-style">\n          <BootstrapNavbar.Brand as="span">\n            BSA Troop 485{" "}\n            {admin ? <span style={{ color: "#99ccff" }}>| Admin</span> : <></>}\n          </BootstrapNavbar.Brand>\n        </Link>\n        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />\n        <BootstrapNavbar.Collapse\n          id="basic-navbar-nav"\n          className="justify-content-end"\n        >\n          <Nav activeKey={pageName}>\n            <NavbarLink page="/page-2">Page 2</NavbarLink>\n            <NavbarLink page="/404">Link Name 2</NavbarLink>\n            <NavbarLink page="/plc/voting/admin">PLC Admin</NavbarLink>\n            {/*<Link to="/plc/voting/vote" className="link-no-style">*/}\n            {/*  <Button>PLC Voting</Button> /!* TODO: delete *!/*/}\n            {/*</Link>*/}\n          </Nav>\n        </BootstrapNavbar.Collapse>\n        {/* </Container> */}\n      </BootstrapNavbar>\n    </>\n  )\n}\nexport default Navbar\n',
    },
    "/Users/jmeng/Documents/code/t485/src/components/layout/seo.tsx": {
      language: "typescript",
      mutants: [
        {
          id: "24",
          location: {
            end: { column: 2, line: 98 },
            start: { column: 4, line: 24 },
          },
          mutatorName: "BlockStatement",
          replacement: "{}",
          status: "Survived",
        },
        {
          id: "25",
          location: {
            end: { column: 22, line: 25 },
            start: { column: 10, line: 25 },
          },
          mutatorName: "ConditionalExpression",
          replacement: "false",
          status: "Survived",
        },
        {
          id: "26",
          location: {
            end: { column: 22, line: 25 },
            start: { column: 10, line: 25 },
          },
          mutatorName: "ConditionalExpression",
          replacement: "true",
          status: "Survived",
        },
        {
          id: "27",
          location: {
            end: { column: 17, line: 25 },
            start: { column: 15, line: 25 },
          },
          mutatorName: "LogicalOperator",
          replacement: "&&",
          status: "Survived",
        },
        {
          id: "28",
          location: {
            end: { column: 22, line: 25 },
            start: { column: 18, line: 25 },
          },
          mutatorName: "StringLiteral",
          replacement: '""',
          status: "Survived",
        },
        {
          id: "31",
          location: {
            end: { column: 31, line: 26 },
            start: { column: 29, line: 26 },
          },
          mutatorName: "LogicalOperator",
          replacement: "&&",
          status: "Survived",
        },
        {
          id: "30",
          location: {
            end: { column: 34, line: 26 },
            start: { column: 17, line: 26 },
          },
          mutatorName: "ConditionalExpression",
          replacement: "true",
          status: "Survived",
        },
        {
          id: "29",
          location: {
            end: { column: 34, line: 26 },
            start: { column: 17, line: 26 },
          },
          mutatorName: "ConditionalExpression",
          replacement: "false",
          status: "Survived",
        },
        {
          id: "32",
          location: {
            end: { column: 34, line: 26 },
            start: { column: 32, line: 26 },
          },
          mutatorName: "StringLiteral",
          replacement: '"Stryker was here!"',
          status: "Survived",
        },
        {
          id: "36",
          location: {
            end: { column: 20, line: 27 },
            start: { column: 18, line: 27 },
          },
          mutatorName: "ArrayDeclaration",
          replacement: '["Stryker was here"]',
          status: "Survived",
        },
        {
          id: "34",
          location: {
            end: { column: 20, line: 27 },
            start: { column: 10, line: 27 },
          },
          mutatorName: "ConditionalExpression",
          replacement: "true",
          status: "Survived",
        },
        {
          id: "33",
          location: {
            end: { column: 20, line: 27 },
            start: { column: 10, line: 27 },
          },
          mutatorName: "ConditionalExpression",
          replacement: "false",
          status: "Survived",
        },
        {
          id: "35",
          location: {
            end: { column: 17, line: 27 },
            start: { column: 15, line: 27 },
          },
          mutatorName: "LogicalOperator",
          replacement: "&&",
          status: "Survived",
        },
        {
          id: "39",
          location: {
            end: { column: 25, line: 28 },
            start: { column: 23, line: 28 },
          },
          mutatorName: "LogicalOperator",
          replacement: "&&",
          status: "Survived",
        },
        {
          id: "37",
          location: {
            end: { column: 28, line: 28 },
            start: { column: 14, line: 28 },
          },
          mutatorName: "ConditionalExpression",
          replacement: "false",
          status: "Survived",
        },
        {
          id: "38",
          location: {
            end: { column: 28, line: 28 },
            start: { column: 14, line: 28 },
          },
          mutatorName: "ConditionalExpression",
          replacement: "true",
          status: "Survived",
        },
        {
          id: "40",
          location: {
            end: { column: 28, line: 28 },
            start: { column: 26, line: 28 },
          },
          mutatorName: "ArrayDeclaration",
          replacement: '["Stryker was here"]',
          status: "Survived",
        },
        {
          id: "42",
          location: {
            end: { column: 71, line: 44 },
            start: { column: 27, line: 44 },
          },
          mutatorName: "ConditionalExpression",
          replacement: "false",
          status: "Survived",
        },
        {
          id: "43",
          location: {
            end: { column: 71, line: 44 },
            start: { column: 27, line: 44 },
          },
          mutatorName: "ConditionalExpression",
          replacement: "true",
          status: "Survived",
        },
        {
          id: "41",
          location: {
            end: { column: 6, line: 41 },
            start: { column: 12, line: 31 },
          },
          mutatorName: "StringLiteral",
          replacement: '""',
          status: "Survived",
        },
        {
          id: "44",
          location: {
            end: { column: 41, line: 44 },
            start: { column: 39, line: 44 },
          },
          mutatorName: "LogicalOperator",
          replacement: "&&",
          status: "Survived",
        },
        {
          id: "45",
          location: {
            end: { column: 8, line: 50 },
            start: { column: 23, line: 48 },
          },
          mutatorName: "ObjectLiteral",
          replacement: "{}",
          status: "Survived",
        },
        {
          id: "47",
          location: {
            end: { column: 8, line: 86 },
            start: { column: 13, line: 53 },
          },
          mutatorName: "ArrayDeclaration",
          replacement: "[]",
          status: "Survived",
        },
        {
          id: "46",
          location: {
            end: { column: 55, line: 52 },
            start: { column: 22, line: 52 },
          },
          mutatorName: "StringLiteral",
          replacement: '""',
          status: "Survived",
        },
        {
          id: "48",
          location: {
            end: { column: 10, line: 57 },
            start: { column: 9, line: 54 },
          },
          mutatorName: "ObjectLiteral",
          replacement: "{}",
          status: "Survived",
        },
        {
          id: "51",
          location: {
            end: { column: 31, line: 59 },
            start: { column: 21, line: 59 },
          },
          mutatorName: "StringLiteral",
          replacement: '""',
          status: "Survived",
        },
        {
          id: "49",
          location: {
            end: { column: 30, line: 55 },
            start: { column: 17, line: 55 },
          },
          mutatorName: "StringLiteral",
          replacement: '""',
          status: "Survived",
        },
        {
          id: "50",
          location: {
            end: { column: 10, line: 61 },
            start: { column: 9, line: 58 },
          },
          mutatorName: "ObjectLiteral",
          replacement: "{}",
          status: "Survived",
        },
        {
          id: "52",
          location: {
            end: { column: 10, line: 65 },
            start: { column: 9, line: 62 },
          },
          mutatorName: "ObjectLiteral",
          replacement: "{}",
          status: "Survived",
        },
        {
          id: "54",
          location: {
            end: { column: 10, line: 69 },
            start: { column: 9, line: 66 },
          },
          mutatorName: "ObjectLiteral",
          replacement: "{}",
          status: "Survived",
        },
        {
          id: "53",
          location: {
            end: { column: 37, line: 63 },
            start: { column: 21, line: 63 },
          },
          mutatorName: "StringLiteral",
          replacement: '""',
          status: "Survived",
        },
        {
          id: "55",
          location: {
            end: { column: 30, line: 67 },
            start: { column: 21, line: 67 },
          },
          mutatorName: "StringLiteral",
          replacement: '""',
          status: "Survived",
        },
        {
          id: "56",
          location: {
            end: { column: 29, line: 68 },
            start: { column: 20, line: 68 },
          },
          mutatorName: "StringLiteral",
          replacement: '""',
          status: "Survived",
        },
        {
          id: "58",
          location: {
            end: { column: 31, line: 71 },
            start: { column: 17, line: 71 },
          },
          mutatorName: "StringLiteral",
          replacement: '""',
          status: "Survived",
        },
        {
          id: "57",
          location: {
            end: { column: 10, line: 73 },
            start: { column: 9, line: 70 },
          },
          mutatorName: "ObjectLiteral",
          replacement: "{}",
          status: "Survived",
        },
        {
          id: "59",
          location: {
            end: { column: 29, line: 72 },
            start: { column: 20, line: 72 },
          },
          mutatorName: "StringLiteral",
          replacement: '""',
          status: "Survived",
        },
        {
          id: "63",
          location: {
            end: { column: 32, line: 79 },
            start: { column: 17, line: 79 },
          },
          mutatorName: "StringLiteral",
          replacement: '""',
          status: "Survived",
        },
        {
          id: "61",
          location: {
            end: { column: 34, line: 75 },
            start: { column: 17, line: 75 },
          },
          mutatorName: "StringLiteral",
          replacement: '""',
          status: "Survived",
        },
        {
          id: "62",
          location: {
            end: { column: 10, line: 81 },
            start: { column: 9, line: 78 },
          },
          mutatorName: "ObjectLiteral",
          replacement: "{}",
          status: "Survived",
        },
        {
          id: "60",
          location: {
            end: { column: 10, line: 77 },
            start: { column: 9, line: 74 },
          },
          mutatorName: "ObjectLiteral",
          replacement: "{}",
          status: "Survived",
        },
        {
          id: "66",
          location: {
            end: { column: 30, line: 88 },
            start: { column: 11, line: 88 },
          },
          mutatorName: "ConditionalExpression",
          replacement: "false",
          status: "Survived",
        },
        {
          id: "64",
          location: {
            end: { column: 10, line: 85 },
            start: { column: 9, line: 82 },
          },
          mutatorName: "ObjectLiteral",
          replacement: "{}",
          status: "Survived",
        },
        {
          id: "65",
          location: {
            end: { column: 38, line: 83 },
            start: { column: 17, line: 83 },
          },
          mutatorName: "StringLiteral",
          replacement: '""',
          status: "Survived",
        },
        {
          id: "67",
          location: {
            end: { column: 30, line: 88 },
            start: { column: 11, line: 88 },
          },
          mutatorName: "ConditionalExpression",
          replacement: "true",
          status: "Survived",
        },
        {
          id: "68",
          location: {
            end: { column: 28, line: 88 },
            start: { column: 27, line: 88 },
          },
          mutatorName: "EqualityOperator",
          replacement: "<=",
          status: "Survived",
        },
        {
          id: "70",
          location: {
            end: { column: 16, line: 92 },
            start: { column: 15, line: 89 },
          },
          mutatorName: "ObjectLiteral",
          replacement: "{}",
          status: "Survived",
        },
        {
          id: "69",
          location: {
            end: { column: 28, line: 88 },
            start: { column: 27, line: 88 },
          },
          mutatorName: "EqualityOperator",
          replacement: ">=",
          status: "Survived",
        },
        {
          id: "72",
          location: {
            end: { column: 44, line: 91 },
            start: { column: 40, line: 91 },
          },
          mutatorName: "StringLiteral",
          replacement: '""',
          status: "Survived",
        },
        {
          id: "73",
          location: {
            end: { column: 17, line: 93 },
            start: { column: 15, line: 93 },
          },
          mutatorName: "ArrayDeclaration",
          replacement: '["Stryker was here"]',
          status: "Survived",
        },
        {
          id: "71",
          location: {
            end: { column: 33, line: 90 },
            start: { column: 23, line: 90 },
          },
          mutatorName: "StringLiteral",
          replacement: '""',
          status: "Survived",
        },
      ],
      source:
        '/**\n * SEO component that queries for data with\n *  Gatsby\'s useStaticQuery React hook\n *\n * See: https://www.gatsbyjs.org/docs/use-static-query/\n */\n\nimport React from "react"\nimport Helmet from "react-helmet"\nimport { useStaticQuery, graphql } from "gatsby"\n\nfunction SEO({\n  description,\n  lang,\n  meta,\n  keywords,\n  title,\n}: {\n  description?: string\n  lang?: string\n  meta?: any[]\n  keywords?: string[]\n  title: string\n}) {\n  lang = lang || "en"\n  description = description || ""\n  meta = meta || []\n  keywords = keywords || []\n\n  const { site } = useStaticQuery(\n    graphql`\n      query {\n        site {\n          siteMetadata {\n            title\n            description\n            author\n          }\n        }\n      }\n    `\n  )\n\n  const metaDescription = description || site.siteMetadata.description\n\n  return (\n    <Helmet\n      htmlAttributes={{\n        lang,\n      }}\n      title={title}\n      titleTemplate={`%s | ${site.siteMetadata.title}`}\n      meta={[\n        {\n          name: `description`,\n          content: metaDescription,\n        },\n        {\n          property: `og:title`,\n          content: title,\n        },\n        {\n          property: `og:description`,\n          content: metaDescription,\n        },\n        {\n          property: `og:type`,\n          content: `website`,\n        },\n        {\n          name: `twitter:card`,\n          content: `summary`,\n        },\n        {\n          name: `twitter:creator`,\n          content: site.siteMetadata.author,\n        },\n        {\n          name: `twitter:title`,\n          content: title,\n        },\n        {\n          name: `twitter:description`,\n          content: metaDescription,\n        },\n      ]\n        .concat(\n          keywords.length > 0\n            ? {\n                name: `keywords`,\n                content: keywords.join(`, `),\n              }\n            : []\n        )\n        .concat(meta)}\n    />\n  )\n}\n\nexport default SEO\n',
    },
    "/Users/jmeng/Documents/code/t485/src/components/voting/VotingGroup.tsx": {
      language: "typescript",
      mutants: [
        {
          id: "76",
          location: {
            end: { column: 8, line: 55 },
            start: { column: 20, line: 46 },
          },
          mutatorName: "ArrowFunction",
          replacement: "() => undefined",
          status: "Killed",
        },
        {
          id: "74",
          location: {
            end: { column: 2, line: 58 },
            start: { column: 39, line: 40 },
          },
          mutatorName: "BlockStatement",
          replacement: "{}",
          status: "Killed",
        },
        {
          id: "75",
          location: {
            end: { column: 63, line: 45 },
            start: { column: 51, line: 45 },
          },
          mutatorName: "BooleanLiteral",
          replacement: "description",
          status: "Survived",
        },
        {
          id: "77",
          location: {
            end: { column: 60, line: 50 },
            start: { column: 15, line: 50 },
          },
          mutatorName: "StringLiteral",
          replacement: '""',
          status: "Killed",
        },
        {
          id: "78",
          location: {
            end: { column: 55, line: 52 },
            start: { column: 20, line: 52 },
          },
          mutatorName: "ConditionalExpression",
          replacement: "false",
          status: "Survived",
        },
        {
          id: "80",
          location: {
            end: { column: 52, line: 52 },
            start: { column: 51, line: 52 },
          },
          mutatorName: "EqualityOperator",
          replacement: "<=",
          status: "Survived",
        },
        {
          id: "79",
          location: {
            end: { column: 55, line: 52 },
            start: { column: 20, line: 52 },
          },
          mutatorName: "ConditionalExpression",
          replacement: "true",
          status: "Survived",
        },
        {
          id: "81",
          location: {
            end: { column: 52, line: 52 },
            start: { column: 51, line: 52 },
          },
          mutatorName: "EqualityOperator",
          replacement: ">=",
          status: "Survived",
        },
        {
          id: "83",
          location: {
            end: { column: 49, line: 52 },
            start: { column: 47, line: 52 },
          },
          mutatorName: "StringLiteral",
          replacement: '"Stryker was here!"',
          status: "Survived",
        },
        {
          id: "82",
          location: {
            end: { column: 46, line: 52 },
            start: { column: 45, line: 52 },
          },
          mutatorName: "ArithmeticOperator",
          replacement: "-",
          status: "Survived",
        },
        {
          id: "84",
          location: {
            end: { column: 55, line: 52 },
            start: { column: 53, line: 52 },
          },
          mutatorName: "UnaryOperator",
          replacement: "+1",
          status: "Survived",
        },
        {
          id: "85",
          location: {
            end: { column: 58, line: 53 },
            start: { column: 21, line: 53 },
          },
          mutatorName: "ArrowFunction",
          replacement: "() => undefined",
          status: "Killed",
        },
      ],
      source:
        'import React, { ReactElement } from "react"\nimport { Form } from "react-bootstrap"\n\nexport interface VotingGroupProps {\n  /**\n   * The title of the group.\n   */\n  title?: string;\n  /**\n   * The description of the group.\n   */\n  description?: string;\n  /**\n   * The options to render. Each option should have a label property dictating what will be\n   * shown to the user, and a value property, which will be referenced in events.\n   */\n  options: {\n    /**\n     * TEST Label\n     */\n    label: string;\n    value: string | number;\n  }[];\n  /**\n   * An array of values that should be selected.\n   */\n  value?: (string|number)[];\n  /**\n   * A callback that will be called with the value of an option that changes.\n   * @param value\n   */\n  onSelectChange: (value: string|number) => void;\n}\nexport const VotingGroup = ({\n  title,\n  description,\n  options,\n  value,\n                              onSelectChange\n}: VotingGroupProps): ReactElement => {\n  return (\n\n    <div>\n      <h4 className="mb-1">{title}</h4>\n      <p className="text-muted mb-2 mt-1" hidden={!description}>{description}</p>\n      {options.map((opt, i) => (\n        <Form.Check\n          key={i}\n          custom\n          id={`check-${i}-${typeof opt.value}-${opt.value}`} // required for react bootstrap\n          label={opt.label}\n          checked={value?.indexOf(opt.value + "") > -1}\n          onChange={(): void => onSelectChange(opt.value)}\n        />\n      ))}\n    </div>\n  )\n}\nexport default VotingGroup\n',
    },
    "/Users/jmeng/Documents/code/t485/src/pages/404.tsx": {
      language: "typescript",
      mutants: [
        {
          id: "86",
          location: {
            end: { column: 2, line: 12 },
            start: { column: 22, line: 6 },
          },
          mutatorName: "ArrowFunction",
          replacement: "() => undefined",
          status: "Survived",
        },
      ],
      source:
        'import React from "react"\n\nimport Layout from "../components/layout/Layout"\nimport SEO from "../components/layout/seo"\n\nconst NotFoundPage = () => (\n  <Layout>\n    <SEO title="404: Not found" />\n    <h1>NOT FOUND</h1>\n    <p>You just hit a route that does not exist... the sadness.</p>\n  </Layout>\n)\n\nexport default NotFoundPage\n',
    },
    "/Users/jmeng/Documents/code/t485/src/pages/index.tsx": {
      language: "typescript",
      mutants: [
        {
          id: "87",
          location: {
            end: { column: 2, line: 49 },
            start: { column: 19, line: 8 },
          },
          mutatorName: "ArrowFunction",
          replacement: "() => undefined",
          status: "Survived",
        },
        {
          id: "88",
          location: {
            end: { column: 6, line: 22 },
            start: { column: 19, line: 10 },
          },
          mutatorName: "StringLiteral",
          replacement: '""',
          status: "Survived",
        },
        {
          id: "89",
          location: {
            end: { column: 6, line: 47 },
            start: { column: 13, line: 23 },
          },
          mutatorName: "ArrowFunction",
          replacement: "() => undefined",
          status: "Survived",
        },
        {
          id: "91",
          location: {
            end: { column: 33, line: 30 },
            start: { column: 22, line: 30 },
          },
          mutatorName: "StringLiteral",
          replacement: '""',
          status: "Survived",
        },
        {
          id: "90",
          location: {
            end: { column: 73, line: 30 },
            start: { column: 21, line: 30 },
          },
          mutatorName: "ArrayDeclaration",
          replacement: "[]",
          status: "Survived",
        },
        {
          id: "93",
          location: {
            end: { column: 59, line: 30 },
            start: { column: 47, line: 30 },
          },
          mutatorName: "StringLiteral",
          replacement: '""',
          status: "Survived",
        },
        {
          id: "92",
          location: {
            end: { column: 45, line: 30 },
            start: { column: 35, line: 30 },
          },
          mutatorName: "StringLiteral",
          replacement: '""',
          status: "Survived",
        },
        {
          id: "94",
          location: {
            end: { column: 72, line: 30 },
            start: { column: 61, line: 30 },
          },
          mutatorName: "StringLiteral",
          replacement: '""',
          status: "Survived",
        },
      ],
      source:
        'import React from "react"\nimport { Container, Button } from "react-bootstrap"\nimport Layout from "../components/layout/Layout"\nimport SEO from "../components/layout/seo"\nimport "../styles/index.scss"\nimport { graphql, StaticQuery } from "gatsby"\n\nconst IndexPage = () => (\n  <StaticQuery\n    query={graphql`\n      query {\n        desktop: file(\n          relativePath: { eq: "bg_cropped_progressive_darken25.jpg" }\n        ) {\n          childImageSharp {\n            fluid(quality: 100, maxWidth: 1920) {\n              ...GatsbyImageSharpFluid\n            }\n          }\n        }\n      }\n    `}\n    render={data => (\n      <Layout\n        pageName="index"\n        backgroundImage={data.desktop.childImageSharp.fluid}\n      >\n        <SEO\n          title="Home"\n          keywords={[`Troop 485`, `Scouting`, `Boy Scouts`, `Cupertino`]}\n        />\n        <Container className="text-center container">\n          <header className="major">\n            <h1>Troop 485</h1>\n            <p>Cupertino, California</p>\n            <div>\n              <Button variant="outline-light" size="lg" className="cta">\n                About Us\n              </Button>\n              <Button variant="primary" size="lg" className="cta">\n                Join Today\n              </Button>\n            </div>\n          </header>\n        </Container>\n      </Layout>\n    )}\n  />\n)\n\nexport default IndexPage\n',
    },
    "/Users/jmeng/Documents/code/t485/src/pages/page-2.tsx": {
      language: "typescript",
      mutants: [
        {
          id: "95",
          location: {
            end: { column: 2, line: 12 },
            start: { column: 22, line: 6 },
          },
          mutatorName: "ArrowFunction",
          replacement: "() => undefined",
          status: "Survived",
        },
      ],
      source:
        'import React from "react"\n\nimport Layout from "../components/layout/Layout"\nimport SEO from "../components/layout/seo"\n\nconst NotFoundPage = () => (\n  <Layout>\n    <SEO title="404: Not found" />\n    <h1>NOT FOUND</h1>\n    <p>You just hit a route that does not exist... the sadness.</p>\n  </Layout>\n)\n\nexport default NotFoundPage\n',
    },
    "/Users/jmeng/Documents/code/t485/src/setupTests.ts": {
      language: "typescript",
      mutants: [
        {
          id: "97",
          location: {
            end: { column: 2, line: 13 },
            start: { column: 49, line: 8 },
          },
          mutatorName: "BlockStatement",
          replacement: "{}",
          status: "Survived",
        },
        {
          id: "96",
          location: {
            end: { column: 68, line: 5 },
            start: { column: 25, line: 5 },
          },
          mutatorName: "StringLiteral",
          replacement: '""',
          status: "Survived",
        },
        {
          id: "98",
          location: {
            end: { column: 4, line: 12 },
            start: { column: 35, line: 9 },
          },
          mutatorName: "ObjectLiteral",
          replacement: "{}",
          status: "Survived",
        },
        {
          id: "100",
          location: {
            end: { column: 23, line: 18 },
            start: { column: 14, line: 18 },
          },
          mutatorName: "StringLiteral",
          replacement: '""',
          status: "Survived",
        },
        {
          id: "99",
          location: {
            end: { column: 2, line: 19 },
            start: { column: 29, line: 17 },
          },
          mutatorName: "ObjectLiteral",
          replacement: "{}",
          status: "Survived",
        },
        {
          id: "103",
          location: {
            end: { column: 44, line: 27 },
            start: { column: 11, line: 27 },
          },
          mutatorName: "ObjectLiteral",
          replacement: "{}",
          status: "Survived",
        },
        {
          id: "102",
          location: {
            end: { column: 2, line: 25 },
            start: { column: 68, line: 23 },
          },
          mutatorName: "BlockStatement",
          replacement: "{}",
          status: "Survived",
        },
        {
          id: "101",
          location: {
            end: { column: 2, line: 22 },
            start: { column: 71, line: 20 },
          },
          mutatorName: "BlockStatement",
          replacement: "{}",
          status: "Survived",
        },
      ],
      source:
        'import { configure } from "enzyme";\nimport React16Adapter from "enzyme-adapter-react-16";\nimport {JSDOM} from "jsdom";\n\nconst jsdom = new JSDOM(\'<!doctype html><html><body></body></html>\');\nconst { window } = jsdom;\n\nfunction copyProps(src: any, target: any): void {\n  Object.defineProperties(target, {\n    ...Object.getOwnPropertyDescriptors(src),\n    ...Object.getOwnPropertyDescriptors(target),\n  });\n}\n\n(global as any).window = window;\n(global as any).document = window.document;\n(global as any).navigator = {\n  userAgent: \'node.js\',\n};\n(global as any).requestAnimationFrame = function (callback: any): any {\n  return setTimeout(callback, 0);\n};\n(global as any).cancelAnimationFrame = function (id: number): void {\n  clearTimeout(id);\n};\ncopyProps(window, global);\nconfigure({ adapter: new React16Adapter() });',
    },
  },
  schemaVersion: "1.0",
  thresholds: { break: null, high: 80, low: 60 },
}
