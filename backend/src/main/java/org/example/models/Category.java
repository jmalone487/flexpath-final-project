package org.example.models;

public class Category {

    private int id;
    private String name;
    private String description;
    private boolean isPublic;
    private String username;

    public Category() {
    }

    public Category(int id, String name, String description, boolean isPublic, String username) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.isPublic = isPublic;
        this.username = username;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean aPublic) {
        isPublic = aPublic;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}