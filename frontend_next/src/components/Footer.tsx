const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <div className="col-md-12" id="foot_nav">
        <div className="row">
          <div className="col-md-3">
            <img id="footer_images" src="" alt="logo" />
          </div>
          <div className="col-md-3">
            <div id="foot_tabs_head">Navigate</div>
            <ul id="foot_tabs">
              <li>
                <a href=""> Accessibility </a>
              </li>
              <li>
                <a href=""> Track your Order</a>{" "}
              </li>
              <li>
                <a href="">Blog</a>
              </li>
              <li>
                <a href=""> About Us</a>
              </li>
              <li>
                <a href="">Disclaimer</a>
              </li>
              <li>
                <a href="">Privacy and Policy</a>
              </li>
              <li>
                <a href="">Terms and Conditions</a>
              </li>
              <li>
                <a href="">Notice of Privacy Practicies</a>
              </li>
              <li>
                <a href="">Shipping & Returns</a>
              </li>
            </ul>
          </div>

          <div className="col-md-3">
            <div id="foot_tabs_head">Contact us </div>
            <ul id="foot_tabs">
              <li>
                <a href="">help@gmail.com</a>
              </li>
              <li>
                <a href="">www.doshpharmaceautical.com</a>
              </li>
              <li>
                <a href="">0557750073</a>
              </li>
              {/* <!-- <li><a href=""></a></li>
                        <li><a href=""></a></li> --> */}
            </ul>
          </div>

          <div className="col-md-3">
            <div id="foot_tabs_head"> Popular brands </div>
            <ul id="foot_tabs">
              <li>
                <a href=""> </a>
              </li>
              <li>
                <a href=""></a>
              </li>
              <li>
                <a href=""></a>
              </li>
              <li>
                <a href=""></a>
              </li>
              <li>
                <a href=""></a>
              </li>
              <li>
                <a href=""></a>
              </li>
              <li>
                <a href=""></a>
              </li>
              <li>
                <a href=""></a>
              </li>
            </ul>
          </div>

          <hr />
          <div id="copyright">
            {" "}
            ©️ {currentYear} Dosh Pharmaceauticals. All rights served.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
