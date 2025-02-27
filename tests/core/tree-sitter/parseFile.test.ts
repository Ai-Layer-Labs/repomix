import { describe, expect, test, vi } from 'vitest';
import type { RepomixConfigMerged } from '../../../src/config/configSchema.js';
import { parseFile } from '../../../src/core/tree-sitter/parseFile.js';

describe('parseFile', () => {
  // Test for JavaScript (js and jsx)
  test('should parse JavaScript correctly', async () => {
    const fileContent = 'function sayHello(name) { console.log("Hello, " + name); }';
    const filePath = 'dummy.js';
    const config = {};
    const result = await parseFile(fileContent, filePath, config as RepomixConfigMerged);
    expect(typeof result).toBe('string');
    expect(result).toContain('sayHello');
  });

  test('should parse JSX correctly', async () => {
    const fileContent = 'function sayHello(name) { console.log("Hello, " + name); }';
    const filePath = 'dummy.jsx';
    const config = {};
    const result = await parseFile(fileContent, filePath, config as RepomixConfigMerged);
    expect(typeof result).toBe('string');
    expect(result).toContain('sayHello');
  });

  // Test for TypeScript (ts, tsx)
  test('should parse TypeScript correctly', async () => {
    const fileContent = 'function sayHello(name) { console.log("Hello, " + name); }';
    const filePath = 'dummy.ts';
    const config = {};
    const result = await parseFile(fileContent, filePath, config as RepomixConfigMerged);
    expect(typeof result).toBe('string');
    expect(result).toContain('sayHello');
  });

  test('should parse TypeScript definitions correctly', async () => {
    const fileContent = `
      interface UserInterface {
        name: string;
        age: number;
        greet(): void;
      }

      type UserType = {
        id: number;
        email: string;
      };

      class UserService extends BaseService implements UserInterface {
        constructor(private deps: Dependencies) {
          super();
        }

        async getUser(
          id: number,
          options: {
            include: string[];
            cache: boolean;
          }
        ) {
          return null;
        }
      }

      const createUser = (
        data: {
          name: string;
          age: number;
        },
        config?: {
          validate: boolean;
        }
      ) => {
        return data;
      };
    `;
    const filePath = 'dummy.ts';
    const config = {};
    const result = await parseFile(fileContent, filePath, config as RepomixConfigMerged);

    // インターフェースは完全な定義を含む
    expect(result).toContain('interface UserInterface');
    expect(result).toContain('name: string');
    expect(result).toContain('age: number');
    expect(result).toContain('greet(): void');

    // 型定義も完全な定義を含む
    expect(result).toContain('type UserType');
    expect(result).toContain('id: number');
    expect(result).toContain('email: string');

    // クラス定義は extends/implements までを含む
    expect(result).toContain('class UserService extends BaseService implements UserInterface');
    expect(result).not.toContain('constructor');
    expect(result).not.toContain('private deps');

    // 関数定義は引数定義までを含む
    expect(result).toContain('async getUser(');
    expect(result).toContain('id: number');
    expect(result).toContain('options: {');
    expect(result).toContain('include: string[]');
    expect(result).toContain('cache: boolean');
    expect(result).not.toContain('return null');

    // アロー関数も同様
    expect(result).toContain('const createUser = (');
    expect(result).toContain('data: {');
    expect(result).toContain('name: string');
    expect(result).toContain('config?: {');
    expect(result).toContain('validate: boolean');
    expect(result).not.toContain('return data');
  });

  test('should parse TSX correctly', async () => {
    const fileContent = 'function greet(name: string){ console.log("Hello, " + name); }';
    const filePath = 'dummy.tsx';
    const config = {};
    const result = await parseFile(fileContent, filePath, config as RepomixConfigMerged);
    expect(typeof result).toBe('string');
    expect(result).toContain('greet');
  });

  // Test for Python
  test('should parse Python correctly', async () => {
    const fileContent = 'def greet(name): print(f"Hello, {name}")';
    const filePath = 'dummy.py';
    const config = {};
    const result = await parseFile(fileContent, filePath, config as RepomixConfigMerged);
    expect(typeof result).toBe('string');
    expect(result).toContain('greet');
  });

  // Test for Rust
  test('should parse Rust correctly', async () => {
    const fileContent = 'fn main() { println!("Hello, world!"); }';
    const filePath = 'dummy.rs';
    const config = {};
    const result = await parseFile(fileContent, filePath, config as RepomixConfigMerged);
    expect(typeof result).toBe('string');
    expect(result).toContain('main');
  });

  // Test for Go
  test('should parse Go correctly', async () => {
    const fileContent = 'func main() { fmt.Println("Hello, world!") }';
    const filePath = 'dummy.go';
    const config = {};
    const result = await parseFile(fileContent, filePath, config as RepomixConfigMerged);
    expect(typeof result).toBe('string');
    expect(result).toContain('main');
  });

  // Test for C++
  test('should parse C++ correctly', async () => {
    const fileContent = 'int main() { std::cout << "Hello, world!"; return 0; }';
    const filePath = 'dummy.cpp';
    const config = {};
    const result = await parseFile(fileContent, filePath, config as RepomixConfigMerged);
    expect(typeof result).toBe('string');
    expect(result).toContain('main');
  });

  test('should parse C++ header correctly', async () => {
    const fileContent = 'int main() { std::cout << "Hello, world!"; return 0; }';
    const filePath = 'dummy.hpp';
    const config = {};
    const result = await parseFile(fileContent, filePath, config as RepomixConfigMerged);
    expect(typeof result).toBe('string');
    expect(result).toContain('main');
  });

  // Test for C
  test('should parse C correctly', async () => {
    const fileContent = 'int main() { printf("Hello, world!"); return 0; }';
    const filePath = 'dummy.c';
    const config = {};
    const result = await parseFile(fileContent, filePath, config as RepomixConfigMerged);
    expect(typeof result).toBe('string');
    expect(result).toContain('main');
  });

  test('should parse C header correctly', async () => {
    const fileContent = 'int main() { printf("Hello, world!"); return 0; }';
    const filePath = 'dummy.h';
    const config = {};
    const result = await parseFile(fileContent, filePath, config as RepomixConfigMerged);
    expect(typeof result).toBe('string');
    expect(result).toContain('main');
  });

  // Test for C#
  test('should parse C# correctly', async () => {
    const fileContent = 'class Program { static void Main() { Console.WriteLine("Hello, world!"); } }';
    const filePath = 'dummy.cs';
    const config = {};
    const result = await parseFile(fileContent, filePath, config as RepomixConfigMerged);
    expect(typeof result).toBe('string');
    expect(result).toContain('Main');
  });

  // Test for Ruby
  test('should parse Ruby correctly', async () => {
    const fileContent = 'def greet(name) puts "Hello, #{name}" end';
    const filePath = 'dummy.rb';
    const config = {};
    const result = await parseFile(fileContent, filePath, config as RepomixConfigMerged);
    expect(typeof result).toBe('string');
    expect(result).toContain('greet');
  });

  // Test for Java
  test('should parse Java correctly', async () => {
    const fileContent =
      'public class HelloWorld { public static void main(String[] args) { System.out.println("Hello, world!"); } }';
    const filePath = 'dummy.java';
    const config = {};
    const result = await parseFile(fileContent, filePath, config as RepomixConfigMerged);
    expect(typeof result).toBe('string');
    expect(result).toContain('main');
  });

  // Test for PHP
  test('should parse PHP correctly', async () => {
    const fileContent = `
<?php

// Define a function called greet
function greet($name) {
    // The function will print a greeting message using the passed parameter
    echo "Hello, " . $name . "!";
}

// Call the function
greet("John");

?>
`;

    const filePath = 'dummy.php';
    const config = {};
    const result = await parseFile(fileContent, filePath, config as RepomixConfigMerged);
    expect(typeof result).toBe('string');
    expect(result).toContain('greet');
  });

  // Test for Swift
  test('should parse Swift correctly', async () => {
    const fileContent = 'func greet(name: String) { print("Hello, (name)") }';
    const filePath = 'dummy.swift';
    const config = {};
    const result = await parseFile(fileContent, filePath, config as RepomixConfigMerged);
    expect(typeof result).toBe('string');
    expect(result).toContain('greet');
  });
});
