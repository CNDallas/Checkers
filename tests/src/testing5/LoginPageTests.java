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
		driver.get("http://proj-319-048.misc.iastate.edu");
        driver.findElement(By.linkText("Create an Account")).click();
        driver.findElement(By.partialLinkText("Login")).click();
        
        driver.getTitle();
        
		assertEquals("Can't get from register page to login", "Fact Checkers - Login", driver.getTitle());
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
		driver.navigate().to("http://proj-319-048.misc.iastate.edu");
        driver.findElement(By.linkText("Login")).click();
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
		driver.navigate().to("http://proj-319-048.misc.iastate.edu");
        driver.findElement(By.linkText("Login")).click();
		element = driver.findElement(By.name("username"));
		element.sendKeys("banjo");
		element = driver.findElement(By.name("password"));
		element.sendKeys("password");
		element.submit();
		
		assertTrue("Login did not return incorrect username error",
				driver.getPageSource().contains("Incorrect username/password"));
		assertEquals("Not at login page", "Fact Checkers - Login", driver.getTitle());
	}
	
	@Test
	public void successfulLogin() {
		driver.navigate().to("http://proj-319-048.misc.iastate.edu");
        driver.findElement(By.linkText("Login")).click();
		element = driver.findElement(By.name("username"));
		element.sendKeys("selenium");
		element = driver.findElement(By.name("password"));
		element.sendKeys("selenium");
		element.submit();
		
		assertFalse("Login returned error",
				driver.getPageSource().contains("Incorrect username/password"));
		assertEquals("Not at user homepage", "Home", driver.getTitle());
		
		driver.navigate().to("http://proj-319-048.misc.iastate.edu/dashboard/logout.php");
		
		assertEquals("Logout unsucessful", "Fact Checkers", driver.getTitle());
		//selenium
	}
	
	@Test
	public void redirectUserAlreadyLoggedIn() {
		driver.navigate().to("http://proj-319-048.misc.iastate.edu");
        driver.findElement(By.linkText("Login")).click();
		element = driver.findElement(By.name("username"));
		element.sendKeys("selenium");
		element = driver.findElement(By.name("password"));
		element.sendKeys("selenium");
		element.submit();
		
		driver.navigate().to("http://proj-319-048.misc.iastate.edu");
		driver.findElement(By.linkText("Login")).click();
		
		assertEquals("Not at user homepage", "Home", driver.getTitle());
		
		driver.navigate().to("http://proj-319-048.misc.iastate.edu/dashboard/logout.php");
		
		assertEquals("Logout unsucessful", "Fact Checkers", driver.getTitle());
	}
	

}
