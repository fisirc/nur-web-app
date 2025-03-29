const std = @import("std");
const gen_bindings = @import("./generated_bindings.zig");

pub fn init() void {
    _ = gen_bindings.git_libgit2_init();
}

pub fn deinit() void {
    _ = gen_bindings.git_libgit2_shutdown();
}

pub fn cloneRepository(url: [:0]const u8, local_path: [:0]const u8) !void {
    var repo: ?*gen_bindings.git_repository = null;
    _ = gen_bindings.git_clone(&repo, url, local_path, null);
}

