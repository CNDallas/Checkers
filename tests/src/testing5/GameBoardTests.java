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

public class GameBoardTests {


	
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
		boolean noimg = false;
		driver.get("http://proj-319-048.misc.iastate.edu/checkers/game.html");
        driver.findElement(By.id("cell17")).click();
        driver.findElement(By.id("cell26")).click();
       // driver.findElement(By.xpath("//*[@id='cell26']/img")).isDisplayed();
        assertTrue("checker should be set", driver.findElement(By.xpath("//*[@id='cell26']/img")).isDisplayed());	
        try {
        	driver.findElement(By.xpath("//*[@id='cell27']/img"));
        }
        catch (Exception e) {
        	noimg = true;
        }
        assertTrue("check should not be set",  noimg);
	}
	
	

}
