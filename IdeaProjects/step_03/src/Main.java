import java.util.Scanner;

public class Main {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        System.out.println("================================");
        System.out.println("     COLLEGE MANAGEMENT SYSTEM");
        System.out.println("================================");

        System.out.print("Enter Student ID: ");
        int id = sc.nextInt();
        sc.nextLine();

        System.out.print("Enter Student Name: ");
        String name = sc.nextLine();

        System.out.print("Enter Department: ");
        String department = sc.nextLine();

        System.out.print("Enter Student Age: ");
        int age = sc.nextInt();

        System.out.println("\n----- Student Details -----");
        System.out.println("Student ID: " + id);
        System.out.println("Student Name: " + name);
        System.out.println("Department: " + department);
        System.out.println("Age: " + age);

        System.out.println("\nStudent registered successfully!");

        sc.close();
    }
}