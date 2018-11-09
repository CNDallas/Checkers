package testing5;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.WebDriverWait;

import org.junit.BeforeClass;
import org.junit.AfterClass;
import org.junit.Test;
import static org.junit.Assert.*;

public class LoginPageTests {

	/*
	public static void main(String[] args) {
        // Create a new instance of the Firefox driver
        // Notice that the remainder of the code relies on the interface, 
        // not the implementation.
		System.setProperty("webdriver.chrome.driver", "C:/Program Files/apache-maven-3.6.0/chromedriver.exe");
        WebDriver driver = new ChromeDriver();

        // And now use this to visit Google
        driver.get("http://www.google.com");
        // Alternatively the same thing can be done like this
        // driver.navigate().to("http://www.google.com");

        // Find the text input element by its name
        WebElement element = driver.findElement(By.name("q"));

        // Enter something to search for
        element.sendKeys("Cheese!");

        // Now submit the form. WebDriver will find the form for us from the element
        element.submit();

        // Check the title of the page
        System.out.println("Page title is: " + driver.getTitle());
        
        // Google's search is rendered dynamically with JavaScript.
        // Wait for the page to load, timeout after 10 seconds
        (new WebDriverWait(driver, 10)).until(new ExpectedCondition<Boolean>() {
            public Boolean apply(WebDriver d) {
                return d.getTitle().toLowerCase().startsWith("cheese!");
            }
        });

        // Should see: "cheese! - Google Search"
        System.out.println("Page title is: " + driver.getTitle());
        
        //Close the browser
        driver.quit();
    }
	*/
	
 	private static WebDriver driver;
 	WebElement element;
	
	@BeforeClass
	public static void openBrowser() {
		System.setProperty("webdriver.chrome.driver", "C:/Program Files/apache-maven-3.6.0/chromedriver.exe");
        driver = new ChromeDriver();   
	}
	
	@AfterClass
	public static void closeBrowser() {
		driver.close();
	}
	
	@Test
	public void visitLogin() {
		driver.get("http://proj-319-048.misc.iastate.edu");
        driver.findElement(By.linkText("Login")).click();
        
		assertEquals("Can't get from index.html to login", driver.getCurrentUrl(), "http://proj-319-048.misc.iastate.edu/login/login.php");
		
	}
	
	@Test
	public void navigateToLoginFromRegister() {
		
	}
	
	@Test
	public void visitRegister() {
		driver.get("http://proj-319-048.misc.iastate.edu");
        driver.findElement(By.linkText("Create an Account")).click();
        driver.getTitle();
        
		assertEquals("Can't get from index.html to register", "Fact Checkers - Register", driver.getTitle());
	}
	
	@Test
	public void badPassword() {
		driver.get("http://proj-319-048.misc.iastate.edu/login/login.php");
		element = driver.findElement(By.name("username"));
		element.sendKeys("rhilb11");
		element = driver.findElement(By.name("password"));
		element.sendKeys("password");
		element.submit();
		
		assertTrue("Login did not return incorrect password error",
				driver.getPageSource().contains("Incorrect username/password"));
		assertEquals("Not at login page", "Fact Checkers - Login", driver.getTitle());
		
	}
	
	@Test
	public void invalidUsername() {
		driver.navigate().to("http://proj-319-048.misc.iastate.edu/login/login.php");
		element = driver.findElement(By.name("username"));
		element.sendKeys("banjo");
		element = driver.findElement(By.name("password"));
		element.sendKeys("password");
		element.submit();
		
		assertTrue("Login did not return incorrect username error",
				driver.getPageSource().contains("Incorrect username/password"));
		assertEquals("Not at login page", "Fact Checkers - Login", driver.getTitle());
	}
	
	

}
