const std = @import("std");
const toml = @import("toml");
const git = @import("lib/git2/entry.zig");



const Recipe = struct {
    const Setup = struct {
        url: []const u8,
        branch: []const u8,
    };

    const Build = struct {
        steps: [][]const u8,
    };

    setup: *Setup,
    build: *Build,
};

pub fn main() !void {
    git.init();
    defer git.deinit();

    var arena = std.heap.ArenaAllocator.init(std.heap.page_allocator);
    var parser = toml.Parser(Recipe).init(arena.allocator());
    defer parser.deinit();

    const parsed = try parser.parseFile("example/example_recipe.toml");

    std.debug.print("{s}::{s}\n", .{
        parsed.value.setup.url,
        parsed.value.setup.branch,
    });

    std.debug.print("cloning...", .{});
    try git.cloneRepository("https://github.com/fisirc/nur", "hola");
    std.debug.print("\rdone!       ", .{});
}
