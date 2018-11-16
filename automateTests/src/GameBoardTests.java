
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
	public void moveCheckerPieces() {
		boolean noimg = false;
		driver.get("file:///C:/Users/Ryan/Documents/se319/project-main/Group18/src/game.html");
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
	
	@Test 
	public void turnChange() {
		driver.get("file:///C:/Users/Ryan/Documents/se319/project-main/Group18/src/game.html");
		moveChecker(21,30);
		element = driver.findElement(By.id("turn"));
		assertEquals("Should be red's turn", "red's turn", element.getText());
		moveChecker(44, 37);
		element = driver.findElement(By.id("turn"));
		assertEquals("Should be blue's turn", "blue's turn", element.getText());
	}
	
	@Test
	public void obtainKing() {
		driver.get("file:///C:/Users/Ryan/Documents/se319/project-main/Group18/src/game.html");
		moveChecker(21,30);
		moveChecker(46,39);
		moveChecker(30,37);
		moveChecker(55,46);
		moveChecker(37,55);
		moveChecker(53,46);
		moveChecker(17,24);
		moveChecker(62,53);
		moveChecker(55,62);
		
        try {
        	element = driver.findElement(By.xpath("//*[@id='cell62']/img"));
        }
        catch (Exception e) {
        	
        }
        
        assertTrue("King image should be displayed", element.getAttribute("src").contains("img/p1_king_img.png"));
	
        moveChecker(40,33);
        moveChecker(62,55);
        
        try {
        	element = driver.findElement(By.xpath("//*[@id='cell55']/img"));
        }
        catch (Exception e) {
        	
        }
        
        assertTrue("King image should be displayed", element.getAttribute("src").contains("img/p1_king_img.png"));
	
        moveChecker(33,26);
        moveChecker(12,21);
        moveChecker(26,12);
        moveChecker(21,28);
        moveChecker(42,35);
        moveChecker(14,21);
        moveChecker(39,30);
        moveChecker(5,14);
        moveChecker(12,5);
        
        try {
        	element = driver.findElement(By.xpath("//*[@id='cell5']/img"));
        }
        catch (Exception e) {
        	
        }
        
        assertTrue("King image should be displayed", element.getAttribute("src").contains("img/p2_king_img.png"));
        
        moveChecker(23,37);
        moveChecker(5,23);
        
        try {
        	element = driver.findElement(By.xpath("//*[@id='cell23']/img"));
        }
        catch (Exception e) {
        	
        }
        
        assertTrue("King image should be displayed", element.getAttribute("src").contains("img/p2_king_img.png"));
	}
	
	@Test
	public void performJump() {
		driver.get("file:///C:/Users/Ryan/Documents/se319/project-main/Group18/src/game.html");
		moveChecker(21,30);
		moveChecker(46,39);
		moveChecker(30,37);
		moveChecker(55,46);
		moveChecker(37,55);
		boolean noimg = false;
        try {
        	driver.findElement(By.xpath("//*[@id='cell46']/img"));
        }
        catch (Exception e) {
        	noimg = true;
        }
        
        assertTrue("checker should not be set",  noimg);
        
	}
	
	
	private void moveChecker(int source, int destination) {
		String start = "cell" + source;
		String end = "cell" + destination;
		driver.findElement(By.id(start)).click();
		driver.findElement(By.id(end)).click();
	}
	

}
