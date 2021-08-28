INSERT INTO department (department_name)
VALUES  ("Science"),
        ("Technology"),
        ("Engineering"),
        ("Art"),
        ("Mathematics");

INSERT INTO employee_role (title, salary, department_id)
VALUES  ("coordinator",90000,4),
        ("teacher",30000,1),
        ("intern",5000,3),
        ("specialist",40000,5),
        ("tutor",20000,2);

INSERT INTO employee (first_name,last_name,role_id, manager_id)
VALUES  ("JoJo","Loner",1,null),
        ("Rocky","Racoon",2, null),
        ("Jessica","Jones",3,null),
        ("Bojack","Horseman",4, null),
        ("Posh","Spice",5, null);